import React, { useEffect, useState, useCallback, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "quill/dist/quill.snow.css";
import DropdownMenu from "../helpers/selectCoin/SelectCoin";
import "./index.css";
import RichTextEditor from "../helpers/textEditor/textEditor";
import Swal from "sweetalert2";
import CategoryDropdown from "./CategoryDropdown";
import Title from "src/components/commons/Title";
import { getSections } from "src/services/sectionService";
import {
  createScheduleAnalysis,
  deleteScheduledAnalysis,
  getAnalyses,
  getCoinAnalysis,
  getScheduledAnalyses,
  postAnalysis,
} from "src/services/contentCreationService";
import { AllAnalysis } from "./AllAnalysis";
import DatePicker from "react-datepicker";
import ScheduledJob from "./ScheduledJob";
import { getCoins } from "src/services/coinService";

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
  const [title, setTitle] = useState("");
  const [coinBots, setCoinBots] = useState([]);

  const selectedSection = useMemo(() => {
    return sections.find((section) => section.id == selectedSectionID);
  }, [sections, selectedSectionID]);

  const selectedCoin = useMemo(() => {
    return coinBots.find((section) => section.bot_id == selectedCoinID);
  }, [coinBots, selectedCoinID]);

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
      if (content === null || selectedDate === null || title === "") {
        throw new Error("One or more required fields are missing");
      }

      setIsSubmitting(true);

      const formDataToSchedule = new FormData();
      formDataToSchedule.append("coin_id", selectedCoinID);
      formDataToSchedule.append("section_id", selectedSectionID);
      formDataToSchedule.append("category_name", selectedCategory);
      formDataToSchedule.append("content", `Title: ${title}\n${content}`);
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
      });
      handleGetJobs();
      resetForm();
      setIsAnalysisCreated(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: error.message,
        customClass: "swal",
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
      const response = selectedCoinID
        ? await getCoinAnalysis(selectedCoinID, selectedSectionID)
        : await getAnalyses(selectedSectionID);

      if (!response.success) {
        throw new Error(response.error);
      }

      setItems(response.data);
    } catch (error) {}
  }, [selectedCoinID, selectedSectionID]);

  useEffect(() => {
    setItems([]);
    const fetchData = async () => {
      if (selectedSectionID) {
        await fetchAnalysis();
      }
    };

    fetchData();
  }, [selectedSectionID, fetchAnalysis]);

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
    setTitle("");
    setSelectedDate(null);
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
    [
      selectedCoinID,
      selectedCategory,
      selectedSectionID,
      content,
    ],
  );

  return (
    <div className="analysisMain">
      <Title>Content Creation</Title>
      <div className="analysisSubmain">
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
          <div className="dropdown-container">
            <label htmlFor="coinBotDropdown" className="label"></label>
            <select
              id="coinBotDropdown"
              onChange={handleSectionSelect}
              value={selectedSectionID || ""}
              className="select-dropdown"
              disabled={isFetchingSections || sections.length === 0}
            >
              <option value="" disabled>
                Select Section to Show in the App
              </option>
              {sections.map((section, index) => (
                <option key={index} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <RichTextEditor
          handleImageSelect={handleImageSelect}
          images={selectedImage}
          success={isAnalysisCreated}
          onSuccess={setIsAnalysisCreated}
          onContentChange={handleContentChange}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 5,
            margin: "auto",
          }}
        >
          <button
            className="submitAnalisys"
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
          <button
            className="postLaterButton"
            onClick={() => setShowPostLaterSection(true)}
          >
            Post Later
          </button>
        </div>
        {showPostLaterSection && (
          <div className="postLaterSection">
            <hr />
            <p>Set an Identifier:</p>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "BTC Analysis"'
            />
            <hr />
            <p>Choose date and time to post analysis:</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                dateFormat="Pp"
                required
                placeholderText="Select date and time"
              />
              <button
                className="schButton"
                onClick={handleScheduleSubmit}
                disabled={
                  isSubmitting ||
                  !isFormValid ||
                  !selectedDate ||
                  !title
                }
              >
                Schedule Post
              </button>
            </div>
          </div>
        )}
      </div>
      {items.length > 0 && (
        <AllAnalysis
          items={items}
          fetchAnalysis={fetchAnalysis}
          section_id={selectedSectionID}
          section_name={selectedSection?.name}
          coin_name={selectedCoin?.name}
        />
      )}
      {scheduledJobs.length > 0 && (
        <div className="analysisSubmain">
          <h3>Scheduled Analysis Posts</h3>
          {scheduledJobs.map((job) => (
            <ScheduledJob
              key={job.id}
              title={title}
              job={job}
              onDelete={deleteScheduled}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentCreation;
