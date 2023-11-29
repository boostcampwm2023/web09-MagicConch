export interface MessageButton {
  content: string;
  onClick: () => void;
}

export interface Message {
  tarotId?: number;
  type: 'left' | 'right';
  message?: string;
  profile: string;
  button?: MessageButton;
  shareLinkId?: string;
}
