import React, {Component} from 'react';
import {Link} from 'react-router';

/*Styles*/
import styles from '../style/rooms.scss';
import flexGrid from '../style/flex-grid.scss';

const rooms = [
    {        
        id: 0,
        name: "Main room",
        online: 0,        
    },
    {
        id: 1,
        name: "Cat Lovers",
        online: 0,        
    },    
    {
        id: 2,
        name: "Dogs lovers",
        online: 0,        
    },
    {
        id: 3,
        name: "Positive Thinking",
        online: 0,        
    },     
    {
        id: 4,
        name: "Positive Thinking",
        online: 0,        
    },
    {
        id: 5,
        name: "Positive Thinking",
        online: 0,        
    },
];

class RoomsContainer extends Component{
    render(){        
        return(
        <div className={[styles.rooms, flexGrid.box, flexGrid['box-container']].join(" ")}>
            <ul className={[flexGrid.row, flexGrid['between-xs']].join(" ")}>
                {
                    rooms.map(a => {
                        let address = `/chat/${a.name.replace(" ", "")}`;
                        return (                        
                            <li key={a.id} 
                                className={
                                    [
                                    flexGrid['col-xs-12'],
                                    flexGrid['col-sm-8'],
                                    flexGrid['col-md-6'],
                                    flexGrid['col-lg-4']
                                    ].join(" ")
                                }>
                                <Link to={address} className={flexGrid.box}>{a.name}</Link>
                            </li>
                        )
                    })
                }            
            </ul>
        </div>
        )        
    }
}

export default RoomsContainer;