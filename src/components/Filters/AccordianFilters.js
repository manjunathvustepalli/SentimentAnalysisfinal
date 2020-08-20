import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CodeIcon from '@material-ui/icons/Code';
import TranslateIcon from '@material-ui/icons/Translate';
import MoodIcon from '@material-ui/icons/Mood';
import styled from 'styled-components';
import Keywords from './Keywords';
import DateFilter from './DateFilter';
import Sources from './Sources';
import Languages from './Languages';
import Sentiments from './Sentiments';
import Moods from './Moods';
import SingleDate from './SingleDate';
import SubjectIcon from '@material-ui/icons/Subject';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const IconWithText = styled.div`
  display: flex;
  align-items:center;
  justify-content:center;
`;

export default function ControlledAccordions(props) {
  const {singleDate, toFromDatesHandlers, sources, subSources, sentiments,languages, moods} = props
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
            <IconWithText>
                <VpnKeyIcon style={{marginRight:'10px'}} /> 
                <p>
                Keywords
                </p>
            </IconWithText>
        </AccordionSummary>
        <AccordionDetails>
          <Keywords/>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
            <IconWithText>
                <DateRangeIcon style={{marginRight:'10px'}} /> 
                <p>
                Dates
                </p>
            </IconWithText>
        </AccordionSummary>
        <AccordionDetails>
          {singleDate ? (<SingleDate singleDate={singleDate} />) : (<DateFilter toFromDatesHandlers={toFromDatesHandlers} />)}
          
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
            <IconWithText>
                <TranslateIcon style={{marginRight:'10px'}} /> 
                <p>
                Languages
                </p>
            </IconWithText>
        </AccordionSummary>
        <AccordionDetails>
          <Languages languages={languages} />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
            <IconWithText>
                <CodeIcon style={{marginRight:'10px'}} /> 
                <p>
                Sources
                </p>
            </IconWithText>
        </AccordionSummary>
        <AccordionDetails>
          <Sources  sources={sources}/>
        </AccordionDetails>
      </Accordion>
      {subSources && (
              <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
                  <IconWithText>
                      <SubjectIcon style={{marginRight:'10px'}} /> 
                      <p>
                      Sub Sources
                      </p>
                  </IconWithText>
              </AccordionSummary>
              <AccordionDetails>
                <Sources  sources={subSources}/>
              </AccordionDetails>
            </Accordion>      
      )}
      {sentiments && (
        <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5bh-content"
          id="panel5bh-header"
        >
            <IconWithText>
                <MoodIcon style={{marginRight:'10px'}} /> 
                <p>
                Sentiment
                </p>
            </IconWithText>
        </AccordionSummary>
        <AccordionDetails>
          <Sentiments sentiments={sentiments} />
        </AccordionDetails>
      </Accordion>
      )}
            {moods && (
        <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5bh-content"
          id="panel5bh-header"
        >
            <IconWithText>
                <MoodIcon style={{marginRight:'10px'}} /> 
                <p>
                Moods
                </p>
            </IconWithText>
        </AccordionSummary>
        <AccordionDetails>
          <Moods moods={moods} />
        </AccordionDetails>
      </Accordion>
      )}
    </div>
  );
}