'use client';
import Image from 'next/image';

const ExploreBtn = () => {
  return (
    <button id='explore-btn' onClick={() => console.log('clicked')}>
      <a href='#events'>Explore events</a>
      <Image src='/icons/arrow-down.svg' alt='arrow-down' width={24} height={24} />
    </button>
  );
};

export default ExploreBtn;
