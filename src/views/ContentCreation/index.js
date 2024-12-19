import React, { useEffect, useState, useCallback, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "quill/dist/quill.snow.css";
import DropdownMenu from "../helpers/selectCoin/SelectCoin";
import "./index.css";
import styles from "./index.module.css";
import RichTextEditor from "../helpers/textEditor/textEditor";
import Swal from "sweetalert2";
import CategoryDropdown from "./CategoryDropdown";
import Title from "src/components/commons/Title";
import { getSections } from "src/services/sectionService";
import {
  createScheduleAnalysis,
  deleteScheduledAnalysis,
  generateAnalysisImage,
  getAnalyses,
  getScheduledAnalyses,
  postAnalysis,
} from "src/services/contentCreationService";
import { AllAnalysis } from "./AllAnalysis";
import DatePicker from "react-datepicker";
import ScheduledJob from "./ScheduledJob";
import { getCoins } from "src/services/coinService";
import CIcon from "@coreui/icons-react";
import { cilImagePlus, cilX } from "@coreui/icons";
import { ReactComponent as RenewIcon } from "src/assets/icons/renew.svg";
import { ReactComponent as ScheduleIcon } from "src/assets/icons/scheduled-icon.svg";
import { ReactComponent as CalendarIcon } from "src/assets/icons/calendar.svg";
import { ReactComponent as TitleIcon } from "src/assets/icons/contentCreationIcon.svg";
import { ReactComponent as ImageIcon } from "src/assets/icons/imageICon.svg";
import { Modal } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ContentCreation = () => {
  const [selectedCoinID, setSelectedCoinID] = useState(null);
  const [selectedImage, setSelectedImage] = useState([]);
  const [content, setContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalysisCreated, setIsAnalysisCreated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSectionID, setSelectedSectionID] = useState("");
  const [sections, setSections] = useState([]);
  const [isFetchingSections, setIsFetchingSections] = useState(true);
  const [items, setItems] = useState([]);
  const [showPostLaterSection, setShowPostLaterSection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [coinBots, setCoinBots] = useState([]);
  const [generatedImg, setGeneratedImg] = useState(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [showJobs, setShowJobs] = useState(false);

  const fetchCoins = useCallback(async () => {
    try {
      const response = await getCoins();
      if (!response.success) {
        throw new Error(response.error);
      }
      setCoinBots(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch coins",
        customClass: "swal",
        backdrop: false,
      });
    }
  }, []);

  const deleteScheduled = async (jobId) => {
    try {
      const response = await deleteScheduledAnalysis(jobId);

      if (!response.success) {
        throw new Error(response.error);
      }

      Swal.fire({
        icon: "success",
        title: "Scheduled Post deleted successfully",
        customClass: "swal",
      });
      handleGetJobs();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: error.message || "Failed to delete scheduled post",
        customClass: "swal",
      });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleScheduleSubmit = async () => {
    try {
      if (content === null || selectedDate === null) {
        throw new Error("One or more required fields are missing");
      }

      setIsSubmitting(true);

      const formDataToSchedule = new FormData();
      formDataToSchedule.append("coin_id", selectedCoinID);
      formDataToSchedule.append("category_name", selectedCategory);
      formDataToSchedule.append("content", content);
      formDataToSchedule.append("section_id", selectedSectionID);
      formDataToSchedule.append("image_url", generatedImg);
      formDataToSchedule.append("scheduled_date", selectedDate.toISOString());

      const response = await createScheduleAnalysis(formDataToSchedule);

      if (!response.success) {
        throw new Error(response.error);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Analysis scheduled successfully",
        customClass: "swal",
        backdrop: false,
      });
      setShowPostLaterSection(false);
      handleGetJobs();
      resetForm();
      setIsAnalysisCreated(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: error.message,
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetJobs = async () => {
    try {
      const response = await getScheduledAnalyses();

      if (!response.success) {
        throw new Error(response.error);
      }

      setScheduledJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    }
  };

  useEffect(() => {
    handleGetJobs();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSelectCoin = (coinId) => {
    let selectedCoin = coinBots.find((coin) => coin.id === coinId);
    if (selectedCoin) {
      setSelectedCategory(selectedCoin.category);
    }
    setSelectedCoinID(coinId);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  const handleSectionSelect = (event) => {
    setSelectedSectionID(event.target.value);
  };

  const fetchAnalysis = useCallback(async () => {
    try {
      const response = await getAnalyses(3);

      if (!response.success) {
        throw new Error(response.error);
      }

      setItems(response.data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    setItems([]);
    fetchAnalysis();
  }, [fetchAnalysis]);

  const generateImg = async () => {
    try {
      setIsImageGenerating(true);
      const formData = new FormData();
      formData.append("content", content);
      const response = await generateAnalysisImage(formData);

      if (!response.success) {
        throw new Error(response.error);
      }

      setGeneratedImg(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to generate image",
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setIsImageGenerating(false);
    }
  };

  const fetchSections = useCallback(async () => {
    try {
      const response = await getSections();
      if (!response.succes) {
        throw new Error(response.error);
      }
      setSections(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch sections",
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setIsFetchingSections(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
    fetchCoins();
  }, [fetchSections, fetchCoins]);

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedCoinID(null);
    // setSelectedImage([]);
    setContent(null);
    setSelectedCategory("");
    setSelectedSectionID("");
    setGeneratedImg(null);
  };

  const handleSubmit = async () => {
    // if (selectedImage === null || content === null) {
    //   return Swal.fire({
    //     icon: "error",
    //     title: "One or more required fields are missing",
    //     showConfirmButton: false,
    //     timer: 1000,
    //     customClass: "swal",
    //   });
    // }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("coin_id", selectedCoinID);
    formData.append("content", content);
    // formData.append("images", selectedImage);
    formData.append("image_url", generatedImg);
    formData.append("category_name", selectedCategory);
    formData.append("section_id", selectedSectionID);

    try {
      const response = await postAnalysis(formData);

      if (!response.success) {
        throw new Error(response.error);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Analysis posted successfully",
        customClass: "swal",
        backdrop: false,
      });
      resetForm();
      setIsAnalysisCreated(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to post analysis",
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setIsSubmitting(false);
      fetchAnalysis();
    }
  };

  const isFormValid = useMemo(
    () =>
      selectedCoinID &&
      selectedCategory &&
      selectedSectionID &&
      content && [selectedCoinID, selectedCategory, selectedSectionID, content],
  );

  const isContent = useMemo(
    () => content?.replace(/<[^>]*>?/gm, "").trim().length > 0,
    [content],
  );

  return (
    <div className="analysisMain">
      <Title>
        <TitleIcon
          style={{ height: 35, width: "fit-content", marginRight: 15 }}
        />
        Content Creator
      </Title>
      <div style={{ width: "100%" }}>
        <div className="selectors-container">
          <DropdownMenu
            selectedCoin={selectedCoinID}
            onSelectCoin={handleSelectCoin}
            items={coinBots}
          />
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Section</strong>
                <span> *</span>
              </label>
            </div>
            <select
              className={styles.select}
              required
              onChange={handleSectionSelect}
              value={selectedSectionID || ""}
              disabled={isFetchingSections || sections.length === 0}
            >
              <option value="" disabled>
                Select section
              </option>
              {sections.map((section, index) => (
                <option key={index} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <span className={styles.contentTitle}>Content</span>
        <div className={styles.contentEditorContainer}>
          <RichTextEditor
            handleImageSelect={handleImageSelect}
            images={selectedImage}
            success={isAnalysisCreated}
            onSuccess={setIsAnalysisCreated}
            onContentChange={handleContentChange}
          />
          <div
            style={{
              width: "30%",
              borderRadius: 10,
              background: "#efefef",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: 10,
            }}
          >
            <div
              style={{
                borderRadius: 10,
                background: "white",
                height: 160,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {generatedImg ? (
                <img
                  src={generatedImg}
                  alt="generated img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <button
                  className={styles.generateImgButton}
                  style={{
                    cursor: isImageGenerating
                      ? "wait"
                      : isContent
                        ? "pointer"
                        : "not-allowed",
                    color: !isContent ? "#9d9d9d" : "orange",
                  }}
                  onClick={generateImg}
                  disabled={!isContent || isImageGenerating}
                >
                  <ImageIcon
                    style={{
                      height: 20,
                      width: "fit-content",
                      fill: !isContent ? "#9d9d9d" : "orange",
                    }}
                  />
                  <span>
                    {isImageGenerating
                      ? "Creating picture..."
                      : "Create picture"}
                  </span>
                </button>
              )}
              <button
                className={styles.regenerateImgButton}
                onClick={generateImg}
                disabled={!isContent || isImageGenerating}
                style={{
                  cursor: isImageGenerating
                    ? "wait"
                    : isContent
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                <RenewIcon
                  style={{ fill: generatedImg ? "black" : "#9d9d9d" }}
                />
              </button>
            </div>
            <div style={{ height: 300 }}>
              {isContent ? (
                <p
                  dangerouslySetInnerHTML={{ __html: content }}
                  style={{ height: "fit-content", fontSize: 16 }}
                  className={styles.contentPreview}
                />
              ) : (
                <div className={styles.textMockContainer}>
                  <p style={{ width: "100%", marginTop: 10, marginBottom: 5 }}>
                    -
                  </p>
                  <p style={{ width: "80%" }}>-</p>
                  <p style={{ width: "95%", marginTop: 30 }}>-</p>
                  <p style={{ width: "95%" }}>-</p>
                  <p style={{ width: "80%" }}>-</p>
                  <p style={{ width: "85%" }}>-</p>
                  <p style={{ width: "80%" }}>-</p>
                  <p style={{ width: "90%" }}>-</p>
                  <p style={{ width: "80%" }}>-</p>
                  <p style={{ width: "75%" }}>-</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button
            className="submitAnalisys"
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            className="postLaterButton"
            onClick={() => setShowPostLaterSection(true)}
            disabled={isSubmitting || !isFormValid}
          >
            Schedule
          </button>
        </div>
        <Modal
          size={"xl"}
          show={showPostLaterSection}
          onHide={() => setShowPostLaterSection(false)}
          className={styles.scheduleModal}
          backdrop={false}
        >
          <button className={styles.closeButton}>
            <CIcon
              icon={cilX}
              size="xl"
              onClick={() => setShowPostLaterSection(false)}
            />
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
            }}
          >
            <ScheduleIcon />
            <h3>Schedule the content</h3>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "center",
            }}
          >
            <label htmlFor="date" style={{ fontSize: 18, fontWeight: 600 }}>
              Select Date and Time
            </label>
            <div className={styles.datePicker}>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                name="date"
                timeIntervals={1}
                dateFormat="Pp"
                required
                placeholderText="DD/MM/YYYY HH:MM"
              />
              <CalendarIcon style={{ height: 20 }} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "center",
            }}
          >
            <span style={{ color: "#737373" }}>
              This action cannot be undone
            </span>
            <button
              className="postLaterButton"
              onClick={handleScheduleSubmit}
              disabled={isSubmitting || !isFormValid || !selectedDate}
            >
              {isSubmitting ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </Modal>
      </div>
      {items?.length > 0 && (
        <AllAnalysis
          items={items}
          fetchAnalysis={fetchAnalysis}
          section_id={selectedSectionID}
        />
      )}
      {scheduledJobs?.length > 0 && (
        <div className="analysisSubmain">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setShowJobs(!showJobs)}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <ScheduleIcon style={{ height: 28, width: "fit-content" }} />
              <h4 className="allAnalysisTitle">Scheduled</h4>
            </div>
            {showJobs ? (
              <ExpandLessIcon color="disabled" fontSize="large" />
            ) : (
              <ExpandMoreIcon color="disabled" fontSize="large" />
            )}
          </div>
          {showJobs && (
            <div className="latestPostsContainer">
              {scheduledJobs.map((job) => (
                <ScheduledJob
                  key={job.id}
                  job={job}
                  onDelete={deleteScheduled}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCreation;
