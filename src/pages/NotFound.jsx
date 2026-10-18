import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function NotFound() {
  return (
    <section className="section page-top notfound">
      <div className="container">
        <img src="/gloaro-mark.png" alt="" className="nf-mark" />
        <h1 className="h2">We couldn’t find that page</h1>
        <p>The theme or page you’re looking for may have moved. Browse the gallery to find it.</p>
        <Link to="/themes" className="btn btn-primary"><Icon name="back" size={16} /> Back to themes</Link>
      </div>
    </section>
  );
}
