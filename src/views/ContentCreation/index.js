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
import { cilX } from "@coreui/icons";
import { ReactComponent as RenewIcon } from "src/assets/icons/renew.svg";
import { ReactComponent as ScheduleIcon } from "src/assets/icons/scheduled-icon.svg";
import { ReactComponent as CalendarIcon } from "src/assets/icons/calendar.svg";
import { ReactComponent as TitleIcon } from "src/assets/icons/contentCreationIcon.svg";
import { ReactComponent as ImageIcon } from "src/assets/icons/imageICon.svg";
import { Modal } from "react-bootstrap";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getCategories } from "src/services/categoryService";

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
  const [categories, setCategories] = useState([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setIsFetchingCategories(true);
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch categories",
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setIsFetchingCategories(false);
    }
  }, []);

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

      setIsScheduling(true);

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
      setIsScheduling(false);
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

  function formatContent(content) {
    return content
      .replace(
        /<p>(.*?)<\/p><p><br><\/p>/,
        '<p style="font-size: 20px"><strong>$1</strong></p><p><br></p>',
      )
      .replace(
        /<p><span>(.*?)<\/span><\/p><p><br><\/p>/,
        '<p style="font-size: 20px"><strong>$1</strong></p><p><br></p>',
      );
  }

  useEffect(() => {
    handleGetJobs();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSelectCoin = (coinId, categoryId) => {
    const category = categories.find(
      (category) => category.category_id === parseInt(categoryId),
    );
    setSelectedCategory(category.name);
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
      const contentWithoutImg = content.replace(
        /<img\s+[^>]*src="[^"]*"[^>]*>/,
        "",
      );

      setIsImageGenerating(true);
      const formData = new FormData();
      formData.append("content", contentWithoutImg);
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
    fetchCategories();
  }, [fetchSections, fetchCoins, fetchCategories]);

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
      content &&
      generatedImg && [
        selectedCoinID,
        selectedCategory,
        selectedSectionID,
        content,
        generatedImg,
      ],
  );

  const isContent = useMemo(() => {
    const textContent = content?.replace(/<[^>]*>?/gm, "").trim().length > 0;
    return textContent;
  }, [content]);

  const isImageInContent = useMemo(() => {
    return /<img\s+[^>]*src="[^"]*"[^>]*>/.test(content);
  }, [content]);

  return (
    <div className="analysisMain">
      <Title>
        <TitleIcon
          style={{ height: 35, width: "fit-content", marginRight: 15 }}
          id="contentCreation-titleIcon"
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
            items={categories}
            disabled={
              selectedCoinID || isFetchingCategories || categories.length === 0
            }
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
          <div className={styles.previewCard} id="contentCreation-previewCard">
            <div
              className={styles.previewImgContainer}
              id="contentCreation-previewImgContainer"
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
                id="contentCreation-regenerateImgButton"
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
              {isContent || isImageInContent ? (
                <p
                  dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                  style={{ height: "fit-content", fontSize: 16 }}
                  className={styles.contentPreview}
                  id="contentCreation-contentPreview"
                />
              ) : (
                <div
                  className={styles.textMockContainer}
                  id="contentCreation-textMockContainer"
                >
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
            <ScheduleIcon className="contentCreation-scheduledPosts-icon" />
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
            <div
              className={styles.datePicker}
              id="contentCreation-datePickerContainer"
            >
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
              <CalendarIcon
                style={{ height: 20 }}
                className="contentCreation-scheduledPosts-icon"
              />
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
              disabled={isScheduling || !isFormValid || !selectedDate}
            >
              {isScheduling ? "Scheduling..." : "Schedule"}
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
              <ScheduleIcon
                style={{ height: 28, width: "fit-content" }}
                className="contentCreation-scheduledPosts-icon"
              />
              <h4 className="allAnalysisTitle">Scheduled</h4>
            </div>
            {showJobs ? (
              <ExpandLessIcon
                color="disabled"
                fontSize="large"
                className="chevron-icon"
              />
            ) : (
              <ExpandMoreIcon
                color="disabled"
                fontSize="large"
                className="chevron-icon"
              />
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
