// നിങ്ങളുടെ dashboard-ൽ ഉപയോഗിച്ചിരിക്കുന്ന അതേ supabase-config ഫയൽ ഇവിടെ ഇമ്പോർട്ട് ചെയ്യുന്നു
import { supabase } from './supabase-config.js';

// DOM Elements
const form = document.getElementById('addCourseForm');
const courseContainer = document.getElementById('courseContainer');

document.addEventListener('DOMContentLoaded', fetchCourses);

// Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const courseData = {
        course_name: document.getElementById('courseName').value,
        duration: document.getElementById('duration').value,
        total_fee: document.getElementById('totalFee').value,
        instructor_name: document.getElementById('instructorName').value,
        capacity: document.getElementById('capacity').value,
        status: document.getElementById('courseStatus').value
    };

    const { data, error } = await supabase
        .from('courses')
        .insert([courseData]);

    if (error) {
        alert("Error saving course: " + error.message);
    } else {
        alert("Course added successfully!");
        form.reset(); 
        fetchCourses(); 
    }
});

// Fetch Courses
async function fetchCourses() {
    courseContainer.innerHTML = '<p style="text-align: center; color: #666;">Loading...</p>';

    const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        courseContainer.innerHTML = `<p style="color:red; text-align: center;">Failed to load courses.</p>`;
        return;
    }

    courseContainer.innerHTML = ''; 

    if (courses.length === 0) {
        courseContainer.innerHTML = '<p style="text-align: center; color: #666;">No courses found. Add a new course above.</p>';
        return;
    }

    courses.forEach(course => {
        const badgeColor = course.status === 'Active' ? '#10B981' : '#F59E0B';
        
        const card = document.createElement('div');
        card.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 12px; position: relative;';
        
        card.innerHTML = `
            <span style="position: absolute; top: 12px; right: 12px; background: ${badgeColor}20; color: ${badgeColor}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                ${course.status}
            </span>
            <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #1e293b; padding-right: 60px;">${course.course_name}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; color: #475569;">
                <div>⏱️ ${course.duration}</div>
                <div>💰 ₹${course.total_fee}</div>
                <div>👨‍🏫 ${course.instructor_name}</div>
                <div>🪑 ${course.capacity} Seats</div>
            </div>
        `;
        courseContainer.appendChild(card);
    });
}
