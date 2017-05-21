var setupDelegate;

function initializeDOM(){
    $("#divSettingsContent").accordion({
      collapsible: true,
      heightStyle: "content",
      beforeActivate: function(event, ui) {
        if (ui.newHeader[0]) {var currHeader  = ui.newHeader;var currContent = currHeader.next('.ui-accordion-content');
        } else {var currHeader  = ui.oldHeader;var currContent = currHeader.next('.ui-accordion-content');}
        var isPanelSelected = currHeader.attr('aria-selected') == 'true';
        currHeader.toggleClass('ui-corner-all',isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top',!isPanelSelected).attr('aria-selected',((!isPanelSelected).toString()));
        currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e',isPanelSelected).toggleClass('ui-icon-triangle-1-s',!isPanelSelected);
        currContent.toggleClass('accordion-content-active',!isPanelSelected)
        if (isPanelSelected) { currContent.slideUp(); }  else { currContent.slideDown(); }
        return false; // Cancels the default action
      }
    });

    $("button").button();
    $( "input[type='radio']" ).checkboxradio();
    $("#lblSliderMaxUpdateFrequency").text(Config.simulation.maxUpdate);
    $("#lblVelocitySliderValue").text("(x" + Config.simulation.update + ")");
    $("#lblSliderMinFlightzoneWidth").text(Config.flightZone.minSize.width);
    $("#lblSliderMaxFlightzoneWidth").text(Config.flightZone.maxSize.width);
    $("#lblCurrentSliderFlightzoneWidth").text(Config.flightZone.size.width);
    $("#lblSliderMinFlightzoneHeight").text(Config.flightZone.minSize.height);
    $("#lblSliderMaxFlightzoneHeight").text(Config.flightZone.maxSize.height);
    $("#lblCurrentSliderFlightzoneHeight").text(Config.flightZone.size.height);
    $("#lblSliderMinFlightzoneDepth").text(Config.flightZone.minSize.depth);
    $("#lblSliderMaxFlightzoneDepth").text(Config.flightZone.maxSize.depth);
    $("#lblCurrentSliderFlightzoneDepth").text(Config.flightZone.size.depth);
    $("#lblCurrentSliderDUAVSpeed").text(Config.duav.speed);
    $("#lblSliderMinDUAVSpeed").text(Config.duav.minSpeed);
    $("#lblSliderMaxDUAVSpeed").text(Config.duav.maxSpeed);
    $("#lblSliderMaxNrUavs").text(Config.simulation.maxNumOfUAVs);

    $("#lblCurrentCollisionThresholdDUAV").text(Config.duav.collisionThreshold);
    $("#lblMinCollisionThresholdDUAV").text(Config.duav.minCollisionThreshold);
    $("#lblMaxCollisionThresholdDUAV").text(Config.duav.maxCollisionThreshold);
    $("#lblCurrentWobblingRadiusDUAV").text(Config.duav.wobblingRadius);
    $("#lblMinWobblingRadiusdDUAV").text(Config.duav.minWobblingRadius);
    $("#lblMaxWobblingRadiusdDUAV").text(Config.duav.maxWobblingRadius);
    $("#lblCurrentCommunicationRangeDUAV").text(Config.cluster.communicationRange);
    $("#lblMinCommunicationRangedDUAV").text(Config.cluster.minCommunicationRange);
    $("#lblMaxCommunicationRangedDUAV").text(Config.cluster.maxCommunicationRange);

    $("#lblCurrentSliderMUAVSpeed").text(Config.muav.speed);
    $("#lblSliderMinMUAVSpeed").text(Config.muav.minSpeed);
    $("#lblSliderMaxMUAVSpeed").text(Config.muav.maxSpeed);
    $("#lblCurrentCollisionThresholdMUAV").text(Config.muav.collisionThreshold);
    $("#lblMinCollisionThresholdMUAV").text(Config.muav.minCollisionThreshold);
    $("#lblMaxCollisionThresholdMUAV").text(Config.muav.maxCollisionThreshold);
    $("#lblCurrentWobblingRadiusMUAV").text(Config.muav.wobblingRadius);
    $("#lblMinWobblingRadiusdMUAV").text(Config.muav.minWobblingRadius);
    $("#lblMaxWobblingRadiusdMUAV").text(Config.muav.maxWobblingRadius);
    $("#lblCurrentComminicationRangeMUAV").text(Config.cluster.communicationRange);
    $("#lblMinCommunicationRangedMUAV").text(Config.cluster.minCommunicationRange);
    $("#lblMaxCommunicationRangedMUAV").text(Config.cluster.maxCommunicationRange);

    $("#lblminNumOfBranchesCH").text(Config.cluster.minNumOfBranches);
    $("#lblmaxNumOfBranchesCH").text(Config.cluster.maxNumOfBranches);
    $("#lblCurrentNumOfBranchesCH").text(Config.cluster.numOfBranches);
    $("#lblminFormationAngleCH").text(Config.cluster.minFormationAngle);
    $("#lblmaxFormationAngleCH").text(Config.cluster.maxFormationAngle);
    $("#lblCurrentFormationAngleCH").text(Config.cluster.formationAngle);

    $("button").click(didClickOnReset);
    $("#chbUpdate").change(checkboxUpdateDidChange);
    $("#chbWobbling").change(checkboxWobblingDidChange);
    $("#chbCollisions").change(checkboxAvoidCollisionsDidChange);
    $("#chbChasing").change(checkboxChasingDidChange);
    $("#chbFormation").change(checkboxFormationDidChange);
    $("#radio-fixed").change(checkboxRadioFixedPlaneDidChange);
    $("#radio-3d").change(checkboxRadio3DDidChange);

    $("#nrOfUavsSlider").slider({
      min: 1,
      max: Config.simulation.maxNumOfUAVs,
      step: 1,
      slide: didSlideNrOfUavs
    });

    $("#speedDUAVSlider").slider({
      min: Config.duav.minSpeed,
      max: Config.duav.maxSpeed,
      step: 0.1,
      slide: didSlideDUAVSpeed
    });

    $("#communicationRangeSliderDUAV").slider({
      min: Config.cluster.minCommunicationRange,
      max: Config.cluster.maxCommunicationRange,
      step: 25,
      slide: didSlideCommunicationRangeDUAV
    });

    $("#wobblingRadiusSliderDUAV").slider({
      min: Config.duav.minWobblingRadius,
      max: Config.duav.maxWobblingRadius,
      step: 10,
      slide: didSlideWobblingRadiusDUAV
    });

    $("#collisionThresholdSliderDUAV").slider({
      min: Config.duav.minCollisionThreshold,
      max: Config.duav.maxCollisionThreshold,
      step: 10,
      slide: didSlideCollisionThresholdDUAV
    });


    $("#speedMUAVSlider").slider({
      min: Config.muav.minSpeed,
      max: Config.muav.maxSpeed,
      step: 0.1,
      slide: didSlideMUAVSpeed
    });

    $("#wobblingRadiusSliderMUAV").slider({
      min: Config.muav.minWobblingRadius,
      max: Config.muav.maxWobblingRadius,
      step: 10,
      slide: didSlideWobblingRadiusMUAV
    });

    $("#collisionThresholdSliderMUAV").slider({
      min: Config.muav.minCollisionThreshold,
      max: Config.muav.maxCollisionThreshold,
      step: 10,
      slide: didSlideCollisionThresholdMUAV
    });

    $("#numOfBranchesCHSlider").slider({
      min: Config.cluster.minNumOfBranches,
      max: Config.cluster.maxNumOfBranches,
      step: 1,
      slide: didSlideNumOfBranches
    });

    $("#formationAngleCHSlider").slider({
      min: Config.cluster.minFormationAngle,
      max: Config.cluster.maxFormationAngle,
      step: 0.01,
      slide: didSlideFormationAngle
    });

    $("#velocitySlider").slider({
      min: 1,
      max: Config.simulation.maxUpdate,
      step: 1,
      slide: didSlideVelocitySlider
    });

    $("#flightZoneWidthSlider").slider({
      min: Config.flightZone.minSize.width,
      max: Config.flightZone.maxSize.width,
      step: 250,
      slide: didSlideFlightzoneWidth
    });

    $("#flightZoneHeightSlider").slider({
      min: Config.flightZone.minSize.height,
      max: Config.flightZone.maxSize.height,
      step: 250,
      slide: didSlideFlightzoneHeight
    });

    $("#flightZoneDepthSlider").slider({
      min: Config.flightZone.minSize.depth,
      max: Config.flightZone.maxSize.depth,
      step: 250,
      slide: didSlideFlightzoneDepth
    });

    velocitySlider = $("#velocitySlider");

    $("#numOfBranchesCHSlider").slider("value", Config.cluster.numOfBranches );
    $("#velocitySlider").slider("value", Config.simulation.update );
    $("#formationAngleCHSlider").slider("value", Config.cluster.formationAngle );
    $("#wobblingRadiusSliderMUAV").slider("value", Config.muav.wobblingRadius );
    $("#collisionThresholdSliderMUAV").slider("value", Config.muav.collisionThreshold );
    $("#speedMUAVSlider").slider("value", Config.muav.speed);
    $("#communicationRangeSliderDUAV").slider("value", Config.cluster.communicationRange );
    $("#wobblingRadiusSliderDUAV").slider("value", Config.duav.wobblingRadius );
    $("#collisionThresholdSliderDUAV").slider("value", Config.duav.collisionThreshold );
    $("#speedDUAVSlider").slider("value", Config.duav.speed );
    $("#nrOfUavsSlider").slider("value", Config.simulation.numOfUAVs );
    $("#flightZoneWidthSlider").slider("value", Config.flightZone.size.width );
    $("#flightZoneHeightSlider").slider("value", Config.flightZone.size.height );
    $("#flightZoneDepthSlider").slider("value", Config.flightZone.size.depth );
    $("#lblCurrentSliderNrOfUavs").text(Config.simulation.numOfUAVs);

    $("#chbUpdate").prop("checked", Config.simulation.updateEnabled);
    $("#chbAutoRestart").prop("checked", Config.simulation.restartEnabled);
    $("#chbWobbling").prop("checked", Config.simulation.wobblingEnabled);
    $("#chbCollisions").prop("checked", Config.simulation.separationEnabled);
    $("#chbChasing").prop("checked", Config.simulation.chaseEnabled);
    $("#chbFormation").prop("checked", Config.simulation.formationEnabled);

  }

    function didClickOnReset(){
      controls.resetCanvas();
    }

    function didSlideVelocitySlider(event, ui){
      $("#lblVelocitySliderValue").text("(x"+ui.value+")");
    }

    function checkboxUpdateDidChange(){
      controls.pauseToggle();
    }

    function checkboxWobblingDidChange(){
      controls.wobblingToggle();
    }

    function checkboxAvoidCollisionsDidChange(){
      controls.separationToggle();
    }

    function checkboxChasingDidChange(){
      controls.chaseToggle();
    }

    function checkboxFormationDidChange(){
      controls.formationToggle();
    }

    function didSlideFlightzoneWidth(event, ui){
      $("#lblCurrentSliderFlightzoneWidth").text(ui.value);
      Config.flightZone.size.width = ui.value;
    }

    function didSlideFlightzoneHeight(event, ui){
      $("#lblCurrentSliderFlightzoneHeight").text(ui.value);
      Config.flightZone.size.height = ui.value;
    }

    function didSlideFlightzoneDepth(event, ui){
      $("#lblCurrentSliderFlightzoneDelph").text(ui.value);
      Config.flightZone.size.depth = ui.value;
    }

    function didSlideNrOfUavs(event, ui){
      $("#lblCurrentSliderNrOfUavs").text(ui.value);
      Config.simulation.numOfUAVs = ui.value;
    }

    function checkboxRadioFixedPlaneDidChange(){
      Config.simulation.uavPositioningPlane = true;
    }

    function checkboxRadio3DDidChange(){
      Config.simulation.uavPositioningPlane = false;
    }

    function didSlideDUAVSpeed(event, ui){
      Config.duav.speed = ui.value;
      $("#lblCurrentSliderDUAVSpeed").text(Config.duav.speed);
      setupDelegate.updateDUAVSpeed();
    }

    function didSlideWobblingRadiusDUAV(event, ui){
      Config.duav.wobblingRadius = ui.value;
      $("#lblCurrentWobblingRadiusDUAV").text(Config.duav.wobblingRadius);
      setupDelegate.updateDUAVWobblingRadius();
    }

    function didSlideCommunicationRangeDUAV(event, ui){
      Config.cluster.communicationRange = ui.value;
      $("#lblCurrentCommunicationRangeDUAV").text(ui.value);
      setupDelegate.updateDUAVCommunicationRange();
    }

    function didSlideCollisionThresholdDUAV(event, ui){
      Config.duav.collisionThreshold = ui.value;
      $("#lblCurrentCollisionThresholdDUAV").text(Config.duav.collisionThreshold);
      setupDelegate.updateDUAVCollisionThreshold();
    }

    function didSlideMUAVSpeed(event, ui){
      Config.muav.speed = ui.value;
      $("#lblCurrentSliderMUAVSpeed").text(Config.muav.speed);
      setupDelegate.updateMUAVSpeed();
    }

    function didSlideNumOfBranches(event, ui){
      Config.cluster.numOfBranches = ui.value;
      $("#lblCurrentNumOfBranchesCH").text(Config.cluster.numOfBranches);
      setupDelegate.updateCHNumOfBranches();
    }

    function didSlideFormationAngle(event, ui){
      Config.cluster.formationAngle = ui.value;
      $("#lblCurrentFormationAngleCH").text(Config.cluster.formationAngle);
      setupDelegate.updateCHFormationAngle();
    }

    function didSlideWobblingRadiusMUAV(event, ui){
      Config.muav.wobblingRadius = ui.value;
      $("#lblCurrentWobblingRadiusMUAV").text(Config.muav.wobblingRadius);
      setupDelegate.updateMUAVWobblingRadius();
    }

    function didSlideCollisionThresholdMUAV(event, ui){
      Config.muav.collisionThreshold = ui.value;
      $("#lblCurrentCollisionThresholdMUAV").text(Config.muav.collisionThreshold);
      setupDelegate.updateMUAVCollisionThreshold();
    }
