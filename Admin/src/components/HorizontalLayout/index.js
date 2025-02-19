import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

//actions
import {
  changeLayout,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
  changeLayoutPosition
} from "../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

//components
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
import RightSidebar from "../CommonForBoth/RightSidebar";
import { createSelector } from 'reselect';

const Layout = (props) => {
  let location = useLocation();
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Layout;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      topbarTheme: layout.topbarTheme,
      layoutWidth: layout.layoutWidth,
      isPreloader: layout.isPreloader,
      layoutType: layout.layoutType,
      layoutMode: layout.layoutMode,
      layoutPosition: layout.layoutPosition,
      showRightSidebar: layout.showRightSidebar,
    })
  );
  const {
    topbarTheme,
    layoutWidth,
    isPreloader,
    layoutType,
    layoutMode,
    layoutPosition,
    showRightSidebar
  } = useSelector(selectLayoutProperties);

  /*
  document title
  */
  useEffect(() => {
    const title = location.pathname;
    let currentage = title.charAt(1).toUpperCase() + title.slice(2);

    document.title =
      currentage + " | Minia - React Admin & Dashboard Template";
      
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /*
  layout settings
  */
  useEffect(() => {
    dispatch(changeLayout("horizontal"));
  }, [dispatch]);

  useEffect(() => {
    if (isPreloader === true) {
      document.getElementById("preloader").style.display = "block";

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
      }, 2500);

    } else {
      document.getElementById("preloader").style.display = "none";
    }
  }, [isPreloader]);
  const { changelayoutMode } = props;

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [dispatch, topbarTheme]);

  useEffect(() => {
    if (layoutPosition) {
      dispatch(changeLayoutPosition(layoutPosition));
    }
  }, [dispatch, layoutPosition]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [dispatch, layoutWidth]);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode, layoutType));
    }
  }, [dispatch,changelayoutMode, layoutMode,layoutType]);

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  /*
call dark/light mode
*/

  const onChangeLayoutMode = (value) => {
    if (changelayoutMode) {
      changelayoutMode(value, layoutType);
    }
  };

  return (
    <React.Fragment>
      <div className="pace pace-active" id="preloader">
        <div className="pace-progress" data-progress-text="100%" data-progress="99" style={{ transform: "translate3d(100%, 0px, 0px)" }}>
        <div className="pace-progress-inner"></div>
      </div>
      <div className="pace-activity"></div></div>

      <div id="layout-wrapper">
        <Header
          theme={topbarTheme}
          isMenuOpened={isMenuOpened}
          openLeftMenuCallBack={openMenu}
          onChangeLayoutMode={onChangeLayoutMode}
        />
        <Navbar menuOpen={isMenuOpened} />
        <div className="main-content">{props.children}</div>
        <Footer />
      </div>
      
      {showRightSidebar ? <RightSidebar onChangeLayoutMode={onChangeLayoutMode} /> : null}

    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.any,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any
};

const mapStateToProps = state => {
  return { ...state.Layout };
};

export default connect(mapStateToProps, {
  changelayoutMode,
})(Layout);
