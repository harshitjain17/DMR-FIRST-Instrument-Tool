import RightSection from "./RightSection";
import './MiddleRightSection.css';

//json data
const data = [
    {
        descript1: 'Lorem Lorem Lorem',
        capab1: 'Ipsum Ipsum Ipsum'
    }
];
function MiddleRightSection () {
    let i = 0;
    return (
        <div className = 'middle-right-section'>
            <RightSection description = {data[i].descript1} capabilities = {data[i].capab1}></RightSection>
            <BottomNavBar></BottomNavBar>
        </div>
    );
};

export default MiddleRightSection;