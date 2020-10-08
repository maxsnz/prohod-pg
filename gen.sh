mkdir frontend/components/$1;
touch frontend/components/$1/$1.jsx;
touch frontend/components/$1/$1.module.css;
touch frontend/components/$1/index.js;

echo "import $1 from './$1';

export default $1;" >frontend/components/$1/index.js;

if [ $2 == 'class' ]
then
echo "import React from 'react';
import styles from './$1.module.css';

class $1 extends React.Component {
  constructor() {
    super();
  };

  componentDidMount() {

  }

  render() {
    return (
      <div className={styles.container}></div>
    );
  };
};

export default $1;" >frontend/components/$1/$1.jsx;
else
echo "import React from 'react';
import styles from './$1.module.css';

const $1 = () => (
  <div className={styles.container}></div>
);
export default $1;" >frontend/components/$1/$1.jsx;
fi


echo '@import "config.css";

.container {}' >frontend/components/$1/$1.module.css;
