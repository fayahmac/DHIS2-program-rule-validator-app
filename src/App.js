import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import classes from './App.module.css'
import Setting from './componets/Setting'
import SettingIcon from './componets/settingIcon'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <div className={classes.container}>
        <DataQuery query={query}>
            {({ error, loading, data }) => {
                if (error) {
                    return <span>ERROR</span>
                }
                if (loading) {
                    return <span>...</span>
                }
                return (
                    <>
                    <Setting/>
                    {/* <SettingIcon/> */}
                    
                    </>
                )
            }}
        </DataQuery>
    </div>
)

export default MyApp
