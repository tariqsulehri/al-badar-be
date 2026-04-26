import { lazy } from "react";

const CreateUser = lazy(() => import("../pages/users/createUser"));
const UserList = lazy(() => import("../features/user/user.list"));
const Dashboard = lazy(() => import("../pages/dashboard/dashboard"));

const CreateParty =  lazy(()=> import ("../features/party/create.party"));
const ListParty =  lazy(()=> import ("../features/party/party.list"));

const CreateProv =  lazy(()=> import ("../features/config/provience/create.prov"));
const ListProv =  lazy(()=> import ("../features/config/provience/prov.list"));

const CreateCity =  lazy(()=> import ("../features/config/city/create.city"));
const ListCity =  lazy(()=> import ("../features/config/city/list.city"));

const CreateArea =  lazy(()=> import ("../features/config/area/create.area"));
const ListArea =  lazy(()=> import ("../features/config/area/List.area"));

const CreateSubarea =  lazy(()=> import ("../features/config/subarea/create.subarea"));
const ListSubarea =  lazy(()=> import ("../features/config/subarea/list.subarea"));

const CreateSlide  = lazy(()=> import("../features/slides/create.slides"));
const SlideList =  lazy(()=> import("../features/slides/slides.list"));
const SelectedSlideList =  lazy(()=> import("../features/slides/selected.slides.list"));

const routeObjects = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/users/create",
    component: CreateUser,
  },
  {
    path: "/user/list",
    component: UserList,
  },
  {
    path: "/setup/prov/create",
    component: CreateProv,
  },
  {
    path: "/setup/prov/list",
    component: ListProv,
  },
  {
    path: "/setup/city/create",
    component: CreateCity,
  },
  {
    path: "/setup/city/list",
    component: ListCity,
  },
  {
    path: "/setup/area/create",
    component: CreateArea,
  },
  {
    path: "/setup/area/list",
    component: ListArea,
  },
  {
    path: "/setup/subarea/create",
    component: CreateSubarea,
  },
  {
    path: "/setup/subarea/list",
    component: ListSubarea,
  },
  {
    path: "/party/create",
    component: CreateParty,
  },
  {
    path: "/party/list",
    component: ListParty,
  },
  {
    path: "/slides/create",
    component: CreateSlide,
  },
  {
    path: "/slides/list", 
    component: SlideList,
  },
  {
    path: "/slides/selected_slides", 
    component: SelectedSlideList,
  }
  
];

export default routeObjects;
