import { Layers2 } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Brand() { return <Link to="/" className="brand" aria-label="SkillFlow home"><span className="brand-mark"><Layers2 size={21} strokeWidth={2} /></span>SkillFlow<span style={{ color: 'var(--primary)' }}>.</span></Link>; }
