import TravellersList from '../TravellersList/TravellersList';
import styles from '@/components/TravellersList/TravellersList.module.css';
export default async function OurTravelers() {
  return (
    <section className={styles.our__travellers}>
      <div className="container">
        <TravellersList />
      </div>
    </section>
  );
}
