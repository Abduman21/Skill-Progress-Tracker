import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
export default function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) { const [visible,setVisible] = useState(false); return <div className="password-field"><input {...props} className="input-field" type={visible ? 'text' : 'password'} /><button type="button" className="icon-button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>; }
