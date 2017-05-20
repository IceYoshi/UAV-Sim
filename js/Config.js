let Config = {
  "simulation":{
      "maxUpdate" : 10,
      "maxNumOfUAVs" : 100,
      "numOfUAVs": 75,
      "uavPositioningPlane" : true
  },

  "flightZone": {
    "color": "#e7e7e7",
    "minSize": {
      "width": 500,
      "height": 500,
      "depth": 500
    },
    "maxSize": {
      "width": 1500,
      "height": 1500,
      "depth": 1500
    }
  },

  "cluster": {
    "headColor": "black",
    "branchColors": [
      "#d500cc","#FFFF00","#00FF00","#FF7F00","#9400D3","#057bff"
    ],
    "minCommunicationRange": 50,
    "maxCommunicationRange": 300,
    "communicationRange": 100,
    "minNumOfBranches": 2,
    "numOfBranches": 6,
    "maxNumOfBranches": 10,
    "minFormationAngle": Math.PI * 0.25,
    "formationAngle": Math.PI * 0.75,
    "maxFormationAngle": Math.PI * 1
  },

  "duav": {
    "color": "white",
    "radius": 10,
    "minSpeed": 0.1,
    "speed": 0.8,
    "maxSpeed": 2.0,
    "minCollisionThreshold": 20,
    "collisionThreshold": 40,
    "maxCollisionThreshold": 100,
    "minWobblingRadius": 20,
    "maxWobblingRadius": 200,
    "wobblingRadius": 50
  },

  "muav": {
    "color": "red",
    "radius": 10,
    "minSpeed": 0.1,
    "speed": 0.8,
    "maxSpeed": 2.0,
    "collisionThreshold": 40,
    "minCollisionThreshold": 20,
    "maxCollisionThreshold": 150,
    "collisionThreshold": 60,
    "minWobblingRadius": 50,
    "maxWobblingRadius": 500,
    "wobblingRadius": 150
  }
}
