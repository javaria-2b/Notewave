# Feynman AI Clone

A Next.js application that clones the functionality of Feynman AI, a note-taking application that uses AI to transform recordings, PDFs, and other content into organized notes, quizzes, and flashcards.

## Features

- Create and organize notes in folders
- Record audio and convert it to notes
- Upload PDFs and extract content
- Add YouTube videos as notes
- Generate quizzes and flashcards from notes
- Support for multiple languages, including right-to-left text

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/feynman-ai-clone.git
cd feynman-ai-clone
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory
  - `components/` - Reusable UI components
  - `(protected)/` - Routes that require authentication
    - `home/` - Home page with notes list
    - `note/` - Note detail pages

## Usage

### Creating a Note

1. Click on "Record audio" on the home page
2. Record your audio
3. Save the recording
4. The AI will process the audio and create a note

### Organizing Notes

1. Click on "Create new folder" in the sidebar
2. Enter a folder name
3. Click "Create"
4. Add notes to folders by clicking "Add folder" on a note card

### Viewing Notes

Click on any note card to view its details, including:
- Note content
- Quizzes
- Flashcards
- Transcript

## Future Enhancements

- User authentication
- Cloud storage for notes
- AI-powered note generation
- Real-time collaboration
- Mobile app

## License

This project is licensed under the MIT License - see the LICENSE file for details.
