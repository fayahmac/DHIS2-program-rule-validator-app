import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

class SettingIcon extends React.Component {
    render() {
      return (
        <div>

            {/* <Link to={"/Setting"}> */}
          
          <FontAwesomeIcon icon={faCog} size="2x" style={{position: 'absolute', top:'49px', left:'15px', color:'Highlight'}} />
          {/* </Link> */}

          
        </div>
      );
    }
  }
  
  export default SettingIcon;