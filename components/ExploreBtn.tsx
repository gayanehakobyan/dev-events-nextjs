'use client';
import Image from 'next/image';
import posthog from 'posthog-js';

const ExploreBtn = () => {
  const handleExploreClick = () => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.capture('events_explore_clicked');
    }
    console.log('clicked');
  };

  return (
    <button id='explore-btn' onClick={handleExploreClick}>
      <a href='#events'>Explore events</a>
      <Image src='/icons/arrow-down.svg' alt='arrow-down' width={24} height={24} />
    </button>
  );
};

export default ExploreBtn;
