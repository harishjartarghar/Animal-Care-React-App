import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement{
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph2 extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element to attach the table from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      'heart_rate': 'float',
      'body_temperature':'float',
      'rumination':'float'
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.

      // Add more Perspective configurations here.
      elem.load(this.table);
      elem.setAttribute('view','y_line');
      elem.setAttribute('columns', 'heart_rate');
      elem.setAttribute('columns', 'body_temperature');
      elem.setAttribute('columns', 'rumination');
    
      
    }
  }

  componentDidUpdate() {
    var min = 105;
    var max = 108;
    var rand =  min + (Math.random() * (max-min));
    var min1 = 60;
    var max1 = 65;
    var rand1 =  min1 + (Math.random() * (max1-min1));
    var min2 = 300;
    var max2 = 350;
    var rand2 =  min2 + (Math.random() * (max2-min2));
    // Everytime the data props is updated, insert the data into Perspective table
    if (this.table) {
      // As part of the task, you need to fix the way we update the data props to
      // avoid inserting duplicated entries into Perspective table again.
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to the schema
        return {
          heart_rate: rand1  || 0,
          body_temperature:rand  || 0,
          rumination:rand2  || 0
        };
      }));
    }
  }
}

export default Graph2;
