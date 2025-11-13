import TravellersList from '@/components/TravellersList/TravellersList';
import styles from '@/components/TravellersList/TravellersList.module.css';

export default function OurTravellersPage() {
  return (
    <section className={styles.our__travellers}>
      <div className="container">
        <h2 className={styles.travellers__title}>Наші Мандрівники</h2>
        <TravellersList
          initialPerPage={4}
          loadMorePerPage={4}
          showLoadMoreOnMobile={false}
        />
      </div>
    </section>
  );
}
