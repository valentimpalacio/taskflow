'use client';

import { useEffect, useState } from 'react';

interface PendingChange {
  id: string;
  type: 'task' | 'comment' | 'subtask' | 'tag';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced: boolean;
}

const DB_NAME = 'TaskFlowDB';
const STORE_NAME = 'pendingChanges';

export function useOfflineSync() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Initialize IndexedDB
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => console.error('Database failed to open');

    request.onsuccess = () => {
      setDb(request.result);
      loadPendingChanges(request.result);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingChanges(db);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [db]);

  const loadPendingChanges = (database: IDBDatabase) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      setPendingChanges(request.result);
    };
  };

  const addPendingChange = async (change: Omit<PendingChange, 'id' | 'timestamp'>) => {
    if (!db) return;

    const newChange: PendingChange = {
      ...change,
      id: `${change.type}-${Date.now()}`,
      timestamp: Date.now(),
      synced: false,
    };

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(newChange);

      request.onsuccess = () => {
        setPendingChanges((prev) => [...prev, newChange]);
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  };

  const syncPendingChanges = async (database: IDBDatabase | null) => {
    if (!database || !isOnline || isSyncing) return;

    setIsSyncing(true);

    try {
      for (const change of pendingChanges.filter((c) => !c.synced)) {
        try {
          // Determine endpoint based on type
          const endpoint = getEndpoint(change.type, change.action);
          
          const response = await fetch(endpoint, {
            method: getMethod(change.action),
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(change.data),
          });

          if (response.ok) {
            // Mark as synced
            const transaction = database.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            change.synced = true;
            store.put(change);
          }
        } catch (error) {
          console.error('Sync failed for change:', change, error);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const getEndpoint = (type: string, action: string): string => {
    const endpoints: Record<string, Record<string, string>> = {
      task: {
        create: '/api/tasks',
        update: '/api/tasks',
        delete: '/api/tasks',
      },
      comment: {
        create: '/api/comments',
        update: '/api/comments',
        delete: '/api/comments',
      },
      subtask: {
        create: '/api/subtasks',
        update: '/api/subtasks',
        delete: '/api/subtasks',
      },
      tag: {
        create: '/api/tags',
        update: '/api/tags',
        delete: '/api/tags',
      },
    };

    return endpoints[type]?.[action] || '/api/sync';
  };

  const getMethod = (action: string): string => {
    const methods: Record<string, string> = {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE',
    };
    return methods[action] || 'POST';
  };

  return {
    addPendingChange,
    syncPendingChanges: () => syncPendingChanges(db),
    pendingChanges,
    isSyncing,
    isOnline,
  };
}
