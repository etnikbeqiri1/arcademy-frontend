import React from 'react'
import '../../assets/css/NotFoundPage.css'
import { FaQuestionCircle } from "react-icons/fa"
import '../../assets/css/iconspin.css'
import {Link} from 'react-router-dom'

export default function NotFoundPage() {
    return (
        <div className="mainbox">
            <div className="err">4</div>
            <div className="error-icon">
                <FaQuestionCircle className="icon-spin"/> 
            </div>
            <div className="err2">4</div>
            <div className="msg">
                Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place?
            <p>Let's go <Link to="/">home</Link> and try from there.</p>
            </div>
        </div>
    );
}