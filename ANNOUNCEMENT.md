# Announcing Cloud Storage for Notes

We're excited to announce a major upgrade to our notes application: **Cloud Storage with Redis**!

## What's New

Your notes and folders are now securely stored in the cloud, providing:

- **Persistent Storage**: Your notes are safely stored even if you clear your browser data
- **Access Anywhere**: Access your notes from any device by simply logging in
- **Improved Reliability**: Enterprise-grade Redis database ensures your data is safe
- **Folder Organization**: Organize your notes in custom folders

## How It Works

Our application now uses Redis, a high-performance in-memory database, to store your notes and folders. Each user's data is securely isolated with user-specific keys, ensuring your notes remain private and accessible only to you.

### Folder Organization

Notes are organized in folders, with a default "My Notes" folder created automatically for new users. You can:

- Create custom folders to organize your notes
- Move notes between folders
- Delete folders (notes will be moved to the default folder)

### Data Security

Your data is stored securely with:

- User-specific encryption keys
- Secure Redis connection (TLS/SSL)
- Regular backups
- Isolated user data

## Technical Details

For the technically curious:

- We use Upstash Redis for cloud storage
- Data is stored in JSON format
- Each user has their own namespace in Redis
- Notes and folders are stored as arrays under user-specific keys
- The application automatically handles synchronization between the UI and storage

## What's Next

We're continuing to improve our storage system with upcoming features:

- Export/import functionality
- Enhanced search capabilities
- Collaborative notes
- Version history

## Feedback

We'd love to hear your feedback on this new feature! Please let us know if you encounter any issues or have suggestions for improvements. 