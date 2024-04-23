import React from "react";
import App from App.css


function Setting () {
    return(
        <div>
            <h2> Settings</h2>
            <form>
                <label>
                    Setting
                    <input type= 'text' value = {Setting}>
                    </input>

                </label>
                <button type="submit">
                   Save
                </button>

            </form>
        </div>
    )
}
export default Setting;