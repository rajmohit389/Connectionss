import React, { useContext } from 'react'
import { MsgContext } from '../../App'

export default function Alert() {
    const { msg } = useContext(MsgContext);
    return (
        <>
            {msg ?
                <div className={"alert " + ((msg.error===1) ? "alert-danger":"alert-success")} role="alert">
                    <strong>{msg.message}</strong>
                </div>
                :
                <></>}
        </>
    )
}
