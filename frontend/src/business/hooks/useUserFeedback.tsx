import { feedbackForm } from '@constants/urls';

interface UserFeedbackPrams {
  type: keyof typeof feedbackForm;
}

export function useUserFeedback({ type }: UserFeedbackPrams) {
  const displayForm = () => window.open(feedbackForm[type], '_blank');

  return { displayForm };
}
