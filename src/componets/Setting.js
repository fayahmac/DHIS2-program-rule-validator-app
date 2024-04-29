import React, {useState} from "react";
import './Setting.css';



function Setting () {

    const [theme, setTheme] = useState('light');
    

    const handleThemeChange = (e) => {
        const selectedTheme = e.target.value;
        setTheme(selectedTheme);
    };

    return(
        <div className={`settings-container ${theme}`}>
            <h2> Settings</h2>
            <div>

       
           
                <label>
                    Theme:
                    
                                  
                     <select value={theme} onChange={handleThemeChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    
                  </select>
                   

                 </label>
                <br/>
                <br/>
                <label> Security settings  </label>
                <br/>
                <br/>
                <label>General management </label> 
                
                </div>
                <div className="dhis2-icon">
               
                <i className="fab fa-dhis2"></i>
            </div>
            
        </div>
    )
}
export default Setting;