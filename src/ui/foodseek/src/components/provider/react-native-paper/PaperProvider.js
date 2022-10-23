import React from 'react';
import { Provider} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';


const PaperProvider = ({children}) => {

    return(
        <Provider settings={{
            icon: props => <Ionicons {...props} />
        }}
        >
            {children}
        </Provider>

    );

}

export default PaperProvider;
