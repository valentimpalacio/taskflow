import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the section from "## Screenshots" to "## Tech Stack"
pattern = r'(## .? Screenshots\n\n### Dashboard.*?)(\n<br/>\n\n## )'
replacement = r'''## 📸 Screenshots

### Authentication Views

<div align="center">

| Portuguese | English | Spanish |
|-----------|---------|---------|
| ![Sign In PT](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/01-pt-signin.png) | ![Sign In EN](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/02-en-signin.png) | ![Sign In ES](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/03-es-signin.png) |

</div>

### Dashboard & Main Views

<div align="center">

| Portuguese | English | Spanish |
|-----------|---------|---------|
| ![Dashboard PT](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/04-pt-dashboard.png) | ![Dashboard EN](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/05-en-dashboard.png) | ![Dashboard ES](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/06-es-dashboard.png) |

</div>

### Feature Showcases

<div align="center">

| Kanban Board | Gantt Chart | Calendar View |
|-----------|---------|---------|
| ![Kanban Board](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/07-pt-kanban.png) | ![Gantt Chart](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/08-pt-gantt.png) | ![Calendar View](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/09-pt-calendar.png) |

</div>

### Advanced Features

<div align="center">

| Analytics | Reports | Dark Mode |
|-----------|---------|-----------|
| ![Analytics](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/10-pt-analytics.png) | ![Reports](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/11-pt-reports.png) | ![Dark Mode](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/12-pt-dark-mode.png) |

</div>

### Responsive Design

<div align="center">

| Mobile View |
|-----------|
| ![Mobile](https://raw.githubusercontent.com/valentimpalacio/taskflow/main/screenshots/13-pt-mobile.png) |

</div>

<br/>

## '''

new_content = re.sub(pattern, replacement + r'\2', content, flags=re.DOTALL)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('✅ README.md atualizado com sucesso!')
