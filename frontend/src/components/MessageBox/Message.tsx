interface MessageProps {
  type: 'left' | 'right';
  message: string;
  profile: string;
}

const Message = ({ type, message, profile }: MessageProps) => {
  return (
    <>
      <div className={`max-w-600 chat ${type == 'left' ? 'chat-start' : 'chat-end'}`}>
        <div className="chat-image avatar">
          <div className="w-60 rounded-full">
            <img
              alt="프로필 이미지"
              src={profile}
            />
          </div>
        </div>
        <div
          className={`chat-bubble max-w-none ${type == 'left' ? 'surface-content text-default' : 'surface-point-alt'}`}
        >
          {message}
        </div>
      </div>
    </>
  );
};

export default Message;
