let Config = {
  "simulation": {
      "maxUpdate": 20,
      "update": 1,
      "maxNumOfUAVs": 100,
      "numOfUAVs": 30,
      "uavPositioningPlane": true,
      "updateEnabled": true,
      "restartEnabled": false,
      "wobblingEnabled": true,
      "separationEnabled": true,
      "chaseEnabled": false,
      "formationEnabled": false,
      "runCount": 30,
      "maxRunCount": 100,
      "failedThreshold": 10000,
      "formationEnclosement": true
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
    },
    "size": {
      "width": 500,
      "height": 500,
      "depth": 500
    }
  },

  "cluster": {
    "headColor": "black",
    "branchColors": [
      "#d500cc","#FFFF00","#00FF00","#FF7F00","#9400D3","#057bff"
    ],
    "minCommunicationRange": 50,
    "maxCommunicationRange": 500,
    "communicationRange": 100,
    "minNumOfBranches": 2,
    "numOfBranches": 3,
    "maxNumOfBranches": 10,
    "minFormationAngle": Math.round(Math.PI * 0.25 * 100) / 100,
    "formationAngle": Math.round(Math.PI * 0.5 * 100) / 100,
    "maxFormationAngle": Math.round(Math.PI * 1 * 100) / 100
  },

  "duav": {
    "color": "white",
    "radius": 10,
    "minSpeed": 0.1,
    "speed": 0.8,
    "maxSpeed": 5.0,
    "minCollisionThreshold": 20,
    "collisionThreshold": 40,
    "maxCollisionThreshold": 100,
    "minWobblingRadius": 0,
    "maxWobblingRadius": 500,
    "wobblingRadius": 50
  },

  "muav": {
    "color": "red",
    "radius": 10,
    "minSpeed": 0.1,
    "speed": 0.8,
    "maxSpeed": 5.0,
    "collisionThreshold": 40,
    "minCollisionThreshold": 20,
    "maxCollisionThreshold": 150,
    "collisionThreshold": 60,
    "minWobblingRadius": 0,
    "maxWobblingRadius": 500,
    "wobblingRadius": 150
  }
}
