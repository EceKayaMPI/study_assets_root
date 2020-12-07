jsPsych.plugins['PLAY-slider-response'] = (function() {
  var plugin = {};

  //jsPsych.pluginAPI.registerPreload('WOB-slider-response', 'stimulus', 'audio');
  //jsPsych.pluginAPI.registerPreload('WOB-slider-response');

  plugin.info = {
    name: 'PLAY-slider-response',
    description: '',
    parameters: {

      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider starting value',
        default: 50,
        description: 'Sets the starting value of the slider',
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider width',
        default: null,
        description: 'Width of the slider in pixels.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // HTML ------------------------------------------------------------
    var html = '<div id="jspsych-PLAY-slider-response-wrapper" style="margin: 100px 0px;">';
    html += '<div class="jspsych-PLAY-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
    if (trial.slider_width !== null) {
      html += 'width:' + trial.slider_width + 'px;';
    }
    html += '">';
    html += '<input type="range" value="' + trial.start + '" min="' + trial.min + '" max="' + trial.max + '" step="' + trial.step + '" style="width: 100%;" id="jspsych-audio-slider-response-response"></input>';
    html += '<div>'
    for (var j = 0; j < trial.labels.length; j++) {
      var width = 100 / (trial.labels.length - 1);
      var left_offset = (j * (100 / (trial.labels.length - 1))) - (width / 2);
      html += '<div style="display: inline-block; position: absolute; left:' + left_offset + '%; text-align: center; width: ' + width + '%;">';
      html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + '</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';

    if (trial.prompt !== null) {
      html += trial.prompt;
    }
    // add submit button
    html += '<button id="jspsych-audio-slider-response-next" class="jspsych-btn" ' + (trial.require_movement ? "disabled" : "") + '>' + trial.button_label + '</button>';

    display_element.innerHTML = html;

    // // wobble noise ------------------------------------------------------------
    // const noise = new Tone.Noise({
    //   type: 'white',
    //   volume: -24,
    //   channelCount: 1,
    // }).toMaster();
    //
    // const noiseFilter = new Tone.LFO({
    //   frequency: trial.start,
    //   min: -100,
    //   max: -24,
    //   channelCount: 1,
    // }).connect(noise.volume);
    //
    // noiseFilter.start();
    // noise.start();

    // var semitones = 13;
    // const source = new Tone.Player({
    //   url: "https://tonejs.github.io/audio/loop/FWDL.mp3",
    //   loop: true,
    //   loopStart: 0,
    //   loopEnd: 1,
    // });
    // const shift = new Tone.PitchShift(semitones);
    // source.connect(shift);
    // shift.toMaster();



    var player = new Audio();
    player.src = "https://tonejs.github.io/audio/loop/FWDL.mp3";
    player.loop = true;
    player.playbackRate = 2;
    player.play();


    // response ------------------------------------------------------------
    var response = {
      rt: null,
      response: null
    }; // add freq value l
    if (trial.require_movement) {
      display_element.querySelector('#jspsych-audio-slider-response-response').addEventListener('click', function() {
        display_element.querySelector('#jspsych-audio-slider-response-next').disabled = false;

      })
    }
    // 'continue' button CLICK ------------
    display_element.querySelector('#jspsych-audio-slider-response-next').addEventListener('click', function() {


      // measure response time
      var endTime = performance.now();
      var rt = endTime - startTime;

      response.rt = rt;
      response.response = display_element.querySelector('#jspsych-audio-slider-response-response').value;

      player.pause();

      if (trial.response_ends_trial) {
        end_trial();
      } else {
        display_element.querySelector('#jspsych-audio-slider-response-next').disabled = true;
      }
    });

    // slider CHANGE ------------------------------------------
    // display_element.querySelector('#jspsych-audio-slider-response-response').addEventListener('mousemove', function() {
    //   player.playbackRate.value = display_element.querySelector('#jspsych-audio-slider-response-response').value;
    //   console.log(player.playbackRate.value);
    // });


    display_element.querySelector('#jspsych-audio-slider-response-response').addEventListener('mousemove', function() {
      //	noise.volume.value = display_element.querySelector('#jspsych-audio-slider-response-response').value;
      player.playbackRate = display_element.querySelector('#jspsych-audio-slider-response-response').value;
      console.log(player.playbackRate);
    });













    function end_trial() {
      jsPsych.pluginAPI.clearAllTimeouts();

			// save data
      var trialdata = {
        "rt": response.rt,
        "response": response.response
      };
      display_element.innerHTML = '';

			// next trial
      jsPsych.finishTrial(trialdata);
    }

    var startTime = performance.now();
    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
