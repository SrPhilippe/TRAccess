import { Wrench } from 'lucide-react';

const Maintenance = () => {
  return (
    <div className="feature-container glass-panel" style={{ justifyContent: 'center', height: '100%', minHeight: '300px' }}>
      <div style={{ 
        background: 'rgba(148, 163, 184, 0.1)', 
        padding: '2rem', 
        borderRadius: '50%', 
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Wrench size={48} color="var(--accent-purple)" />
      </div>
      <h2 className="feature-title" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Em Manutenção</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '80%' }}>
        Esta funcionalidade está sendo aprimorada e estará disponível em breve.
      </p>
    </div>
  );
};

export default Maintenance;
