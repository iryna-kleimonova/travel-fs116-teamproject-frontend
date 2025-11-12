import { Story } from '@/types/story';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';

import css from './TravellersStories.module.css';

interface TravellersStoriesProps {
  stories: Story[];
  isAuthenticated: boolean;
}

export default function TravellersStories({
  stories,
  isAuthenticated,
}: TravellersStoriesProps) {
  return (
    <ul className={css.stories__list}>
      {stories.map(story => (
        <TravellersStoriesItem
          key={story._id}
          story={story}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </ul>
  );
}
