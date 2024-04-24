import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import classes from './App.module.css'
import UserManager from './UserManager';

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
                        <h1>
                            {/* {i18n.t('Hello {{name}}', { name: data.me.name })} */}
                        </h1>
                        {/* <h3>{i18n.t('Welcome to DHIS2!')}</h3> */}
                               <UserManager />
                          </>
                )
            }}
        </DataQuery>
    </div>
)

// const App = () => {
//     return (
//       <div>
//         {/* <h1>My App</h1> */}
//         <UserManager />
//       </div>
//     );
//   };



export default MyApp
