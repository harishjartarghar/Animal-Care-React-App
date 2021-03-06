import React, { Component } from 'react';
import DataStreamer, { animal } from './DataStreamer';
import Graph from './Graph';
import '../../src/App.css';
import Modall  from './MODAL';
import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import CustomSegmentLabels from './speed'
import firebase from '../firebase';

/**
 * State declaration for <App />
 */
interface IState {
  data: animal[],
  showGraph: boolean,
  isModalOpen:boolean
  animalname?:string
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class AnimalComponent2 extends Component<{},IState>{
  constructor(props:{}) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
  
    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph:false,
      isModalOpen:false,
      
      
    };
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if(this.state.showGraph)
      {
        return (<Graph data={this.state.data}/>)
      }
      
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    this.toggleModal();
    let x=0;
    const interval=setInterval(()=>
    {
     const animal=firebase.database().ref('animal2');
     animal.on('value',(snapshot)=>{
       var info=[{
         "heart_rate":snapshot.child('heart_rate').val(),
         "body_temperature":snapshot.child('temperature').val(),
         "rumination":snapshot.child('rumination').val()
       }]
      this.setState({ 
        data: info,
        showGraph:true
       });
       
     })
     
    x++;
    if(x>1000)
    {
      clearInterval(interval);
    }
    
  },1200);
}

  /**
   * Render the App react component
   */
  render() {
   
    return (
      <div className="style">
        <br/>
        
    <p className="text1"><b><u>SMART MONITORING ANIMAL HUSBANDRY<br/>Animal 2</u></b></p>
        <br/>
        <div className="styling">
         
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Show Live Data
          </button>
          <Modall/>
          <Modal className="modal-lg" isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>ANALYSIS</ModalHeader>
          <ModalBody>
            <h4><b><u>Data Analysis</u></b></h4>
          <div className="Graph">
            {this.renderGraph()}
          </div>
          <br></br>
         <CustomSegmentLabels/>
         <h5>Health: All Good</h5>
         <h5>Disease: No Disease</h5>
         <h5>Range: Inside</h5>
          </ModalBody>
          </Modal>
          
        </div>
       
      </div>
    )
  }
}



export default AnimalComponent2;
