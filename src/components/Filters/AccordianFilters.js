import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CodeIcon from '@material-ui/icons/Code';
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
import SubSourceAutoComplete from './SubSourceAutoComplete';
import RadioButtons from './RadioButtons';
import SubSourceSingleAutoComplete from './SubSourceSingleAutoComplete';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FormatSizeIcon from '@material-ui/icons/FormatSize';


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
  const {singleDate, radioSources,setKeywords,keywordTypes,keywords, radioSubSources, radioLanguages, AutoCompleteSubSources, toFromDatesHandlers, sources, subSources, sentiments,languages, moods} = props
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      {
        setKeywords && keywordTypes && (
          <Accordion expanded={expanded === 'panel1'} className={classes.accordianStyling} onChange={handleChange('panel1')}>
        <AccordionSummary
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel1' ? 'none' : '1px solid white' }}
          expandIcon={ expanded !== 'panel1' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
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
        <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel1' ? 'none' : '1px solid white' }}
        >
          <Keywords setKeywords={setKeywords} keywordTypes={keywordTypes} keywords={keywords || []} />
        </AccordionDetails>
      </Accordion>
        )
      }
      {
        singleDate || toFromDatesHandlers ?  (
          <Accordion expanded={expanded === 'panel2'} className={classes.accordianStyling} onChange={handleChange('panel2')}>
          <AccordionSummary
            style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel2' ? 'none' : '1px solid white'}}
            expandIcon={ expanded !== 'panel2' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
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
          <AccordionDetails
            style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel2' ? 'none' : '1px solid white'}}
          >
            {singleDate ? (<SingleDate singleDate={singleDate} />) : (<DateFilter toFromDatesHandlers={toFromDatesHandlers} />)}
            
          </AccordionDetails>
        </Accordion>
        ) :''
      }
      {languages && (      
        <Accordion expanded={expanded === 'panel4'} className={classes.accordianStyling} onChange={handleChange('panel4')}>
        <AccordionSummary
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel4' ? 'none' : '1px solid white'}}
          expandIcon={ expanded !== 'panel4' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
            <IconWithText>
                <FormatSizeIcon style={{marginRight:'10px'}} /> 
                <p>
                Languages
                </p>
            </IconWithText>
        </AccordionSummary>
        <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel4' ? 'none' : '1px solid white'}}
        >
          <Languages languages={languages} />
        </AccordionDetails>
      </Accordion>)}
      {
        sources && (
        <Accordion expanded={expanded === 'panel3'} className={classes.accordianStyling} onChange={handleChange('panel3')}>
          <AccordionSummary
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel3' ? 'none' : '1px solid white'}}
          expandIcon={ expanded !== 'panel3' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
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
          <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel3' ? 'none' : '1px solid white'}}
          >
            <Sources  sources={sources}/>
          </AccordionDetails>
        </Accordion>
        )
      }
      {
        subSources && (
          <Accordion expanded={expanded === 'panel8'} className={classes.accordianStyling} onChange={handleChange('panel8')}>
          <AccordionSummary
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel8' ? 'none' : '1px solid white'}}
          
            expandIcon={ expanded !== 'panel8' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
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
          <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel8' ? 'none' : '1px solid white'}}
          >
            <SubSourceAutoComplete subSources={subSources} />
          </AccordionDetails>
        </Accordion>
        )
      }
      {sentiments && (
        <Accordion expanded={expanded === 'panel5'} className={classes.accordianStyling} onChange={handleChange('panel5')}>
        <AccordionSummary
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel5' ? 'none' : '1px solid white'}}
          expandIcon={ expanded !== 'panel5' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
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
        <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel5' ? 'none' : '1px solid white'}}
        >
          <Sentiments sentiments={sentiments} />
        </AccordionDetails>
      </Accordion>
      )}
            {moods && (
        <Accordion expanded={expanded === 'panel6'} className={classes.accordianStyling} onChange={handleChange('panel6')}>
        <AccordionSummary
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel6' ? 'none' : '1px solid white'}}
          expandIcon={ expanded !== 'panel6' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
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
        <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel6' ? 'none' : '1px solid white'}}
        >
          <Moods moods={moods} />
        </AccordionDetails>
      </Accordion>
      )}
      {
        radioLanguages && (
          <Accordion expanded={expanded === 'panel9'} className={classes.accordianStyling} onChange={handleChange('panel9')}>
          <AccordionSummary
            style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel9' ? 'none' : '1px solid white'}}
            expandIcon={ expanded !== 'panel9' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
            aria-controls="panel7bh-content"
            id="panel9bh-header"
          >
              <IconWithText>
                  <FormatSizeIcon style={{marginRight:'10px'}} /> 
                  <p>
                    Select Language
                  </p>
              </IconWithText>
          </AccordionSummary>
          <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel9' ? 'none' : '1px solid white'}}
          >
            <RadioButtons radio={radioLanguages}  />
          </AccordionDetails>
        </Accordion>  
        )
      }
      {
        radioSources && (
          <Accordion expanded={expanded === 'panel7'} className={classes.accordianStyling} onChange={handleChange('panel7')}>
          <AccordionSummary
            style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel7' ? 'none' : '1px solid white'}}
            expandIcon={ expanded !== 'panel7' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
            aria-controls="panel7bh-content"
            id="panel7bh-header"
          >
              <IconWithText>
                  <CodeIcon style={{marginRight:'10px'}} /> 
                  <p>
                    Select Source
                  </p>
              </IconWithText>
          </AccordionSummary>
          <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel7' ? 'none' : '1px solid white'}}
          >
            <RadioButtons radio={radioSources}  />
          </AccordionDetails>
        </Accordion>
        )
      }
      {
        radioSubSources && (
          <Accordion expanded={expanded === 'panel10'} className={classes.accordianStyling} onChange={handleChange('panel10')}>
          <AccordionSummary
            style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel10' ? 'none' : '1px solid white'}}
            expandIcon={ expanded !== 'panel10' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
            aria-controls="panel10bh-content"
            id="panel9bh-header"
          >
              <IconWithText>
                  <SubjectIcon style={{marginRight:'10px'}} /> 
                  <p>
                    Select sub Source
                  </p>
              </IconWithText>
          </AccordionSummary>
          <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel10' ? 'none' : '1px solid white'}}
          >
            <RadioButtons radio={radioSubSources}  />
          </AccordionDetails>
        </Accordion>
        )
      }
      {
        AutoCompleteSubSources && (
          <Accordion expanded={expanded === 'panel11'} className={classes.accordianStyling} onChange={handleChange('panel11')}>
          <AccordionSummary
            style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderBottom:expanded === 'panel11' ? 'none' : '1px solid white'}}
            expandIcon={ expanded !== 'panel11' ? <AddIcon style={{color:'white'}} /> : <RemoveIcon style={{color:'white'}} />}
            aria-controls="panel11bh-content"
            id="panel11bh-header"
          >
              <IconWithText>
                  <SubjectIcon style={{marginRight:'10px'}} /> 
                  <p>
                    Select Sub Source
                  </p>
              </IconWithText>
          </AccordionSummary>
          <AccordionDetails
          style={{backgroundColor:'#2C3335',color:'white',border:'1px solid white',borderTop:expanded === 'panel11' ? 'none' : '1px solid white'}}
          >
            <SubSourceSingleAutoComplete subSources={AutoCompleteSubSources}  />
          </AccordionDetails>
        </Accordion>  
        )
      }
    </div>
  );
}