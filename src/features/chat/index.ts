/**
 * Feature: chat
 * Module 07 — Realtime Text Messaging
 * Module 08 — Message Replies
 * Module 09 — Message Reactions
 * Module 10 — Read Receipts
 * Module 11 — Typing Indicators and Presence
 */

export * from './types';
export * from './components/ChatScreen';
export * from './components/MessageRow';
export * from './components/MessageBubble';
export * from './components/DateSeparator';
export * from './components/MessageComposer';
export * from './components/VirtualizedMessageList';
export * from './components/ReactionPicker';
export * from './components/ReactionPill';
export * from './components/ReactionViewerModal';
export * from './components/ReadReceiptsList';
export * from './components/TypingIndicator';
export * from './hooks/useChatMessages';
export * from './hooks/useReadReceipts';
export * from './hooks/useTyping';
export { messageService } from '../../services/messageService';