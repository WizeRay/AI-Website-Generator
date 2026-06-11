import {createBrowserRouter} from 'react-router';
import Home from '../pages/Home';
import Pricing from '../pages/Pricing';
import Community from '../pages/Community';
import Projects from '../pages/Projects';
import MyProjects from '../pages/MyProjects';
import View from '../pages/View';
import Preview from '../pages/Preview';
import RootLayout from '../layouts/RootLayout';

export const router = createBrowserRouter([
    
    {
        path: "/",
        Component: RootLayout,
        children:[
            {
                index: true,
                Component: Home,
            },
            {
                path:"pricing",
                Component: Pricing,
            },
            {
                path:"projects/:projectId",
                Component: Projects,
            },
            {
                path:"projects",
                Component: MyProjects,
            },
            {
                path:"preview/:projectId",
                Component: Preview,
            },
            {
                path:"preview/:projectId/:versionId",
                Component: Preview,
            },
            {
                path:"community",
                Component: Community,
            },
            {
                path:"view/:projectId",
                Component: View,
            },
        
        ]
}
]);