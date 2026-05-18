'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Tag } from '@/types';

interface TagsInputProps {
  tags: Tag[];
  onAddTag: (tagName: string, color: string) => void;
  onRemoveTag: (tagId: string) => void;
  availableTags?: Tag[];
}

const PRESET_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#F59E0B', // amber
  '#10B981', // emerald
  '#06B6D4', // cyan
  '#EF4444', // red
  '#6366F1', // indigo
];

export default function TagsInput({
  tags,
  onAddTag,
  onRemoveTag,
  availableTags = [],
}: TagsInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      onAddTag(newTagName, selectedColor);
      setNewTagName('');
      setSelectedColor(PRESET_COLORS[0]);
      setIsAdding(false);
    }
  };

  const handleAddExisting = (tag: Tag) => {
    if (!tags.find((t) => t.id === tag.id)) {
      onAddTag(tag.name, tag.color);
    }
    setShowDropdown(false);
  };

  const unusedTags = availableTags.filter((t) => !tags.find((st) => st.id === t.id));

  return (
    <div className="mt-4 space-y-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
      <h3 className="font-semibold text-slate-900 dark:text-white">Tags</h3>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-white"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
            <button
              onClick={() => onRemoveTag(tag.id)}
              className="ml-1 rounded-full hover:bg-black/20"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <form onSubmit={handleAddNew} className="space-y-3 rounded-lg bg-white p-3 dark:bg-slate-700">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Nome da tag..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            autoFocus
          />

          <div className="flex gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`h-6 w-6 rounded-full border-2 transition-transform ${
                  selectedColor === color ? 'border-slate-900 scale-110 dark:border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTagName('');
              }}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium dark:border-slate-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-blue-500 hover:text-blue-500 dark:border-slate-600 dark:text-slate-400 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Adicionar tag
          </button>

          {showDropdown && unusedTags.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-700 z-10">
              {unusedTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleAddExisting(tag)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-600"
                >
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                </button>
              ))}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setIsAdding(true);
                }}
                className="w-full border-t border-slate-200 px-4 py-2 text-left text-sm font-medium text-blue-500 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-600"
              >
                + Criar nova tag
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
