import { Icon } from '@iconify/react/dist/iconify.js';

import { useToast } from './hooks';

export function Toast() {
  const { message, removeToast } = useToast();

  return (
    <>
      {message && (
        <div
          className="toast absolute top-[120%] right-20 animate-shining"
          onClick={removeToast}
        >
          <div className="alert w-fit">
            <Icon
              icon="mingcute:message-3-fill"
              width={24}
            />
            {message}
          </div>
        </div>
      )}
    </>
  );
}
