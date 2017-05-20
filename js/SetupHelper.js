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
    $("#lblSliderMinFlightzoneSize").text(Config.flightZone.minSize.width);
    $("#lblSliderMaxFlightzoneSize").text(Config.flightZone.maxSize.width);
    $("#lblCurrentSliderFlightzoneSize").text(Config.flightZone.minSize.width);
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
    $("#lblCurrentComminicationRangeDUAV").text(Config.cluster.communicationRange);
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

    $("#wobblingRadiusSliderMUAV").slider("value", Config.muav.wobblingRadius );
    $("#collisionThresholdSliderMUAV").slider("value", Config.muav.collisionThreshold );
    $("#speedMUAVSlider").slider("value", Config.muav.speed);
    $("#communicationRangeSliderDUAV").slider("value", Config.cluster.communicationRange );
    $("#wobblingRadiusSliderDUAV").slider("value", Config.duav.wobblingRadius );
    $("#collisionThresholdSliderDUAV").slider("value", Config.duav.collisionThreshold );
    $("#speedDUAVSlider").slider("value", Config.duav.speed );
    $("#nrOfUavsSlider").slider("value", Config.simulation.numOfUAVs );
    $("#lblCurrentSliderNrOfUavs").text(Config.simulation.numOfUAVs);

    $("#velocitySlider").slider({
      min: 1,
      max: Config.simulation.maxUpdate,
      step: 1,
      slide: didSlideVelocitySlider
    });

    $("#flightZoneSizeSlider").slider({
      min: Config.flightZone.minSize.width,
      max: Config.flightZone.maxSize.width,
      step: 250,
      slide: didSlideFlightzoneSize
    });

    velocitySlider = $("#velocitySlider");
  }

    function didClickOnReset(){
        let paused = drawManager.paused;
        drawManager = new DrawManager();
        drawManager.paused = paused;
        initializeObjects();
    }

    function didSlideVelocitySlider(event, ui){
      $("#lblVelocitySliderValue").text("(x"+ui.value+")");
    }

    function checkboxUpdateDidChange(){
      drawManager.paused = !drawManager.paused;
    }

    function checkboxWobblingDidChange(){
      wobbling = !wobbling;
    }

    function checkboxAvoidCollisionsDidChange(){
      collision = !collision;
    }

    function checkboxChasingDidChange(){
      chasing = !chasing;
    }

    function checkboxFormationDidChange(){
      formation = !formation;
    }

    function didSlideFlightzoneSize(event, ui){
      $("#lblCurrentSliderFlightzoneSize").text(ui.value);
      flightZoneSize.width = ui.value;
      flightZoneSize.height = ui.value;
      flightZoneSize.depth = ui.value;
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
      $("#lblCurrentCommunicationRangeDUAV").text(Config.cluster.communicationRange);
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
