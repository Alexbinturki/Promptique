
import React from 'react';

export const Loader: React.FC = () => {
  const messages = [
    "Analyzing reference style...",
    "Fusing facial features...",
    "Crafting the perfect prompt...",
    "Rendering your new persona...",
    "Almost there, adding finishing touches...",
  ];
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-brand-red border-gray-600 rounded-full animate-spin"></div>
      <p className="text-white text-xl mt-6 font-semibold tracking-wide transition-opacity duration-500">{message}</p>
    </div>
  );
};
