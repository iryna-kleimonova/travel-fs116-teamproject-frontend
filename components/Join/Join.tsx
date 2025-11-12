import styles from './Join.module.css';
import JoinLink from './JoinLink';
import JoinScrollHandler from './JoinScrollHandler';

const Join = () => {
  return (
    <>
      <JoinScrollHandler />
      <section id="join" className={styles.section}>
        <div className="container">
          <div className={styles.joinCard}>
            <h2 className={styles.title}>Приєднуйтесь до нашої спільноти</h2>
            <p className={styles.description}>
              Долучайтеся до мандрівників, які діляться своїми історіями та
              надихають на нові пригоди.
            </p>
            <JoinLink />
          </div>
        </div>
      </section>
    </>
  );
};

export default Join;
