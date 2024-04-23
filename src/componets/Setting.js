import React, {useState} from "react";
import './Setting.css';



function Setting () {
    const [theme, setTheme] = useState('light');

    const handleThemeChange = (e) => {
        setTheme(e.target.value);
    };
    const toggleTheme = ()=>{
        setTheme(prevTheme=>prevTheme==='light'? 'dark': 'light');
    };
    return(
        <div className="settings-container">
            <h2> Settings</h2>
            <div>

       
           
                <label>
                    Theme:
                    <select value={theme} onChange={handleThemeChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                   

                    </select>
                    
                </label>
                
        
                </div>
             
               

           
        </div>
    )
}
export default Setting;