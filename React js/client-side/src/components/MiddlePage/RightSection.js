import './RightSection.css';

function RightSection (props) {
    return (
        <div className='right-section'>
            <div>
                <h2>Description</h2>
                <description>{props.description}</description>
            </div>
            <div>
                <h2>capabilities</h2>
                {props.capabilities}
            </div>
        </div>
    );
};

export default RightSection; 