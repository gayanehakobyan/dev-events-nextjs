import ExploreBtn from '@/components/ExploreBtn';
import EventsCard from '@/components/EventsCard';
import { events } from '@/lib/constants';

// const events = [
//   {
//     image: '/images/event1.png',
//     title: 'Event 1',
//     slug: 'event-1',
//     location: 'location-1',
//     date: 'Date-1',
//     time: 'Time-1',
//   },
//   { image: '/images/event2.png', title: 'Event 2' },
// ];

const page = () => {
  return (
    <section>
      <h1 className='text-center'>Welcome next.js</h1>
      <p> Hackaton, all in on place</p>
      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3> Feature Events </h3>
        <ul className='events'>
          {events.map((event, index) => (
            <li key={index}>
              <EventsCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
