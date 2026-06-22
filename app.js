// -------------------------------------------------------------
// Pyodide (WASM Python) Initialization and Console Controller
// -------------------------------------------------------------
let pyodideInstance = null;
let currentOutputBuffer = "";

// Initialize Pyodide
async function initPyodide() {
    const statusText = document.getElementById("status-text");
    const statusDot = document.getElementById("status-dot");
    const globalConsoleTerminal = document.getElementById("global-console-terminal");

    try {
        pyodideInstance = await loadPyodide({
            stdout: (text) => {
                currentOutputBuffer += text + "\n";
            },
            stderr: (text) => {
                currentOutputBuffer += "Error: " + text + "\n";
            }
        });
        
        statusText.textContent = "Python Ready (WASM)";
        statusDot.className = "status-dot ready";
        globalConsoleTerminal.textContent = ">>> Python Environment Initialized.\n>>> Type code above and click Execute.";
        
        // Warm up Pyodide with an execution
        await pyodideInstance.runPythonAsync("print('Pyodide engine is active.')");
        currentOutputBuffer = ""; // Reset warm-up logs
    } catch (err) {
        statusText.textContent = "Load Failed";
        statusDot.className = "status-dot";
        globalConsoleTerminal.textContent = "Failed to load Python: " + err;
        console.error("Pyodide loading error:", err);
    }
}

// Redirect and capture execution outputs
async function runPythonCode(code) {
    if (!pyodideInstance) {
        return "Python environment is still loading. Please wait...";
    }
    currentOutputBuffer = "";
    try {
        const result = await pyodideInstance.runPythonAsync(code);
        // If there was a printed output, show it, otherwise show evaluated result if it isn't None
        if (currentOutputBuffer.trim() === "") {
            if (result !== undefined && result !== null && String(result) !== "None") {
                return String(result);
            }
            return "";
        }
        return currentOutputBuffer;
    } catch (err) {
        return "Traceback (most recent call last):\n" + String(err);
    }
}

// -------------------------------------------------------------
// Navigation and Accordion Control
// -------------------------------------------------------------
function navigateToSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(sec => sec.classList.remove("active"));
    
    // Show targeted section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add("active");
        // Scroll to top of main content
        document.querySelector(".content-body").scrollTop = 0;
    }

    // Toggle active state in sidebar menu
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        if (item.getAttribute("data-target") === sectionId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Update Header breadcrumb
    const headerTitle = document.getElementById("current-section-title");
    const navItem = document.querySelector(`.nav-item[data-target="${sectionId}"]`);
    if (navItem) {
        headerTitle.textContent = navItem.innerText.trim();
    } else if (sectionId === "welcome-section") {
        headerTitle.textContent = "Welcome & Course Introduction";
    }

    // Perform specific tab initialization
    if (sectionId === "module3-section") {
        updateBigOGraph(parseInt(document.getElementById("n-slider").value));
    }
}

// Setup navigation listeners
document.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle trigger
    const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
    const appContainer = document.querySelector(".app-container");
    if (sidebarToggleBtn && appContainer) {
        sidebarToggleBtn.addEventListener("click", () => {
            appContainer.classList.toggle("collapsed");
            const icon = sidebarToggleBtn.querySelector("i");
            if (appContainer.classList.contains("collapsed")) {
                icon.className = "fa-solid fa-chevron-right";
            } else {
                icon.className = "fa-solid fa-chevron-left";
            }
        });
    }

    // Theme toggle trigger
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeText = document.getElementById("theme-text");
    if (themeToggleBtn && themeText) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const icon = themeToggleBtn.querySelector("i");
            if (document.body.classList.contains("light-mode")) {
                icon.className = "fa-solid fa-moon";
                themeText.textContent = "Dark Mode";
            } else {
                icon.className = "fa-solid fa-sun";
                themeText.textContent = "Light Mode";
            }
        });
    }

    // Nav menu items
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-target");
            navigateToSection(target);
        });
    });

    // Accordions toggle
    const accordionTriggers = document.querySelectorAll(".accordion-trigger");
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const item = trigger.closest(".accordion-item");
            item.classList.toggle("open");
        });
    });

    // Initialize components
    initPyodide();
    setupEditors();
    setupLabs();
    setupRecursionVisualizer();
    setupBigOSlider();
    setupBenchmarker();
    loadQuizQuestion();

    // Global Console drawer trigger
    const toggleConsoleBtn = document.getElementById("toggle-console-btn");
    const clearConsoleBtn = document.getElementById("clear-console-btn");
    const minimizeConsoleBtn = document.getElementById("minimize-console-btn");
    const runConsoleBtn = document.getElementById("run-global-console-btn");
    const consoleDrawer = document.getElementById("console-drawer");

    const toggleDrawer = () => {
        consoleDrawer.classList.toggle("expanded");
    };

    toggleConsoleBtn.addEventListener("click", toggleDrawer);
    minimizeConsoleBtn.addEventListener("click", toggleDrawer);
    
    // Clear terminal console
    clearConsoleBtn.addEventListener("click", () => {
        document.getElementById("global-console-terminal").textContent = "Console cleared.\n";
    });

    // Run global editor
    runConsoleBtn.addEventListener("click", async () => {
        const consoleTextarea = document.getElementById("global-console-textarea");
        const consoleTerminal = document.getElementById("global-console-terminal");
        consoleTerminal.textContent = "Running...\n";
        const result = await runPythonCode(consoleTextarea.value);
        consoleTerminal.textContent = result || ">>> Code executed with no printed output.";
    });
});

// -------------------------------------------------------------
// Textarea Editors Setup
// -------------------------------------------------------------
function setupEditors() {
    const editors = document.querySelectorAll(".embedded-editor-container");
    
    editors.forEach(container => {
        const textarea = container.querySelector(".editor-textarea");
        const runBtn = container.querySelector(".run-editor-btn");
        const outputField = container.querySelector(".editor-output");
        
        if (runBtn && textarea && outputField) {
            runBtn.addEventListener("click", async () => {
                outputField.textContent = "Running code...";
                const result = await runPythonCode(textarea.value);
                outputField.textContent = result || "Execution finished (no output).";
            });
        }
    });
}

// -------------------------------------------------------------
// Labs Verification & Testing Logic
// -------------------------------------------------------------
const labTests = {
    lab1_1: {
        tests: `
try:
    assert is_multiple(4, 3) == False
    assert is_multiple(100, 3) == False
    assert is_multiple(4, 2) == True
    assert is_multiple(21, 3) == True
    assert is_multiple(-40, 2) == True
    assert is_multiple(-90, 3) == True
    print("Verification Passed: All unit tests run successfully!")
except AssertionError:
    print("Verification Failed: Return value is incorrect for some test cases.")
except Exception as e:
    print(f"Verification Failed with error: {e}")
`
    },
    lab1_2: {
        tests: `
import inspect
try:
    # Check syntax constraint
    src = inspect.getsource(is_even)
    if '*' in src or '/' in src or '%' in src:
        raise ValueError("Operator violation: Multiplication (*), division (/), or modulo (%) are forbidden!")
    
    assert is_even(0) == True
    assert is_even(3) == False
    assert is_even(9) == False
    assert is_even(4) == True
    assert is_even(10) == True
    assert is_even(-5) == False
    assert is_even(-15) == False
    assert is_even(-20) == True
    assert is_even(-8) == True
    print("Verification Passed: All unit tests run successfully without disallowed operators!")
except AssertionError:
    print("Verification Failed: Return value is incorrect for some values.")
except ValueError as ve:
    print(f"Verification Failed: {ve}")
except Exception as e:
    print(f"Verification Failed with error: {e}")
`
    },
    lab1_3: {
        tests: `
import inspect
try:
    # Check syntax constraint
    src = inspect.getsource(minmax_iter)
    if 'min(' in src or 'max(' in src or 'sorted(' in src or '.sort(' in src:
        raise ValueError("Operator violation: min(), max(), sorted() or .sort() are forbidden!")
        
    assert minmax_iter([1000, -77777, -4, 0, 9999, -99]) == (-77777, 9999)
    assert minmax_iter([4, 2, 3, -1, -2, 0, 1]) == (-2, 4)
    assert minmax_iter([3, 1, 4, 1, 5, 9, 2, 6, 5, 3]) == (1, 9)
    assert minmax_iter([-7, -2, -5, -10, 0]) == (-10, 0)
    assert minmax_iter([42]) == (42, 42)
    print("Verification Passed: All unit tests run successfully!")
except AssertionError:
    print("Verification Failed: Return value is incorrect for some arrays.")
except ValueError as ve:
    print(f"Verification Failed: {ve}")
except Exception as e:
    print(f"Verification Failed with error: {e}")
`
    },
    lab1_4: {
        tests: `
try:
    res1 = count_vowels("tissue")
    assert isinstance(res1, dict), "Result must be a dictionary"
    assert res1.get('a', 0) == 0
    assert res1.get('e', 0) == 1
    assert res1.get('i', 0) == 1
    assert res1.get('o', 0) == 0
    assert res1.get('u', 0) == 1
    
    res2 = count_vowels("okonomiyaki")
    assert res2.get('a', 0) == 1
    assert res2.get('e', 0) == 0
    assert res2.get('i', 0) == 2
    assert res2.get('o', 0) == 3
    assert res2.get('u', 0) == 0
    print("Verification Passed: Vowels count dictionary matched test cases!")
except AssertionError as ae:
    print(f"Verification Failed: Result values incorrect. {ae}")
except Exception as e:
    print(f"Verification Failed with error: {e}")
`
    },
    lab1_5: {
        tests: `
try:
    assert 'result' in globals() or 'result' in locals(), "Variable 'result' is not defined!"
    assert result == [0, 2, 6, 12, 20, 30, 42, 56, 72, 90], f"Result is incorrect: {result}"
    print("Verification Passed: Output matches the sequence of index products [i * (i+1)]!")
except AssertionError as ae:
    print(f"Verification Failed: {ae}")
except Exception as e:
    print(f"Verification Failed with error: {e}")
`
    }
};

function setupLabs() {
    const verifyButtons = document.querySelectorAll(".verify-editor-btn");
    
    verifyButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const labId = btn.getAttribute("data-lab");
            const container = btn.closest(".embedded-editor-container");
            const textarea = container.querySelector(".editor-textarea");
            const outputField = container.querySelector(".editor-output");
            const statusDiv = document.getElementById(labId + "-status");
            
            outputField.textContent = "Verifying solution with tests...\n";
            statusDiv.style.display = "none";
            
            if (!pyodideInstance) {
                outputField.textContent = "Python interpreter is loading. Please try again shortly.";
                return;
            }
            
            // Combine user code and tests
            const executionCode = textarea.value + "\n" + labTests[labId].tests;
            const output = await runPythonCode(executionCode);
            outputField.textContent = output;
            
            // Set verification UI feedback
            if (output.includes("Verification Passed")) {
                statusDiv.className = "verification-status success";
                statusDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> Success! Challenge completed successfully.`;
                statusDiv.style.display = "flex";
            } else {
                statusDiv.className = "verification-status failed";
                statusDiv.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Failed. Check the error traceback in output terminal.`;
                statusDiv.style.display = "flex";
            }
        });
    });
}

function switchLabTab(tabId) {
    const tabs = document.querySelectorAll(".lab-tab");
    const contents = document.querySelectorAll(".lab-tab-content");
    
    tabs.forEach(tab => {
        if (tab.getAttribute("onclick").includes(tabId)) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
    
    contents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add("active");
        } else {
            content.classList.remove("active");
        }
    });
}

// -------------------------------------------------------------
// Module 2: Recursion Visualizer Engine
// -------------------------------------------------------------
let recursionSteps = [];
let currentRecStepIdx = -1;
let recCodeTemplate = {
    factorial: {
        code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
        highlights: [
            [0], // Init
            [1], // If base check
            [2], // Base case return
            [3], // Recursive call call
            [3], // Returning multiplication
        ]
    },
    fibonacci: {
        code: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
        highlights: [
            [0],
            [1],
            [2],
            [3]
        ]
    },
    sum: {
        code: `def sum_n(n):
    if n <= 0:
        return 0
    return n + sum_n(n - 1)`,
        highlights: [
            [0],
            [1],
            [2],
            [3]
        ]
    }
};

function setupRecursionVisualizer() {
    const algorithmSelect = document.getElementById("rec-algorithm");
    const inputField = document.getElementById("rec-input");
    const startBtn = document.getElementById("rec-start-btn");
    const stepBtn = document.getElementById("rec-step-btn");
    const resetBtn = document.getElementById("rec-reset-btn");
    
    // Set initial template code
    updateRecCodeDisplay();
    
    algorithmSelect.addEventListener("change", () => {
        updateRecCodeDisplay();
        resetRecursionVisualizer();
    });
    
    startBtn.addEventListener("click", () => {
        initializeRecursionTrace();
    });
    
    stepBtn.addEventListener("click", () => {
        stepRecursionTrace();
    });
    
    resetBtn.addEventListener("click", () => {
        resetRecursionVisualizer();
    });
}

function updateRecCodeDisplay() {
    const algo = document.getElementById("rec-algorithm").value;
    const codeDisplay = document.getElementById("visualizer-code-display");
    codeDisplay.textContent = recCodeTemplate[algo].code;
}

function resetRecursionVisualizer() {
    const stackContainer = document.getElementById("stack-container");
    const traceLog = document.getElementById("trace-log");
    const stepBtn = document.getElementById("rec-step-btn");
    
    stackContainer.innerHTML = '<div class="empty-stack-msg">Stack is empty. Click Initialize.</div>';
    traceLog.innerHTML = 'Initializing visual logs...';
    
    stepBtn.disabled = true;
    recursionSteps = [];
    currentRecStepIdx = -1;
    updateRecCodeDisplay();
}

function initializeRecursionTrace() {
    const algo = document.getElementById("rec-algorithm").value;
    const n = parseInt(document.getElementById("rec-input").value);
    
    if (isNaN(n) || n < 1 || n > 5) {
        alert("Please enter a valid N between 1 and 5.");
        return;
    }
    
    recursionSteps = [];
    
    if (algo === "factorial") {
        generateFactorialSteps(n);
    } else if (algo === "sum") {
        generateSumSteps(n);
    } else if (algo === "fibonacci") {
        generateFibonacciSteps(n);
    }
    
    currentRecStepIdx = 0;
    document.getElementById("rec-step-btn").disabled = false;
    document.getElementById("trace-log").innerHTML = '<div class="log-entry info">Initialized visual tracker with parameters.</div>';
    renderRecursionStep();
}

// Generate traces
function generateFactorialSteps(n) {
    let callId = 1;
    
    function traceFact(val, parentFrameId) {
        let frameId = callId++;
        // Push call step
        recursionSteps.push({
            type: "call",
            name: `factorial(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 1, // 'if n <= 1:' check
            desc: `Call factorial(${val}). Checking if n <= 1.`
        });
        
        if (val <= 1) {
            recursionSteps.push({
                type: "base",
                name: `factorial(${val})`,
                frameId: frameId,
                parentFrameId: parentFrameId,
                params: { n: val },
                line: 2, // 'return 1'
                retVal: 1,
                desc: `Base case reached! factorial(${val}) returns 1.`
            });
            return 1;
        }
        
        // Push recursive descent step
        recursionSteps.push({
            type: "descent",
            name: `factorial(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 3, // 'return n * factorial(n - 1)'
            desc: `n (${val}) > 1. Needs value of factorial(${val - 1}) first. Spawning call...`
        });
        
        let childVal = traceFact(val - 1, frameId);
        let myVal = val * childVal;
        
        recursionSteps.push({
            type: "return",
            name: `factorial(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 3, // computes multiplication
            retVal: myVal,
            desc: `Returned value: factorial(${val - 1}) = ${childVal}. Compute ${val} * ${childVal} = ${myVal}.`
        });
        
        return myVal;
    }
    
    traceFact(n, null);
}

function generateSumSteps(n) {
    let callId = 1;
    
    function traceSum(val, parentFrameId) {
        let frameId = callId++;
        recursionSteps.push({
            type: "call",
            name: `sum_n(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 1,
            desc: `Call sum_n(${val}). Checking base case condition.`
        });
        
        if (val <= 0) {
            recursionSteps.push({
                type: "base",
                name: `sum_n(${val})`,
                frameId: frameId,
                parentFrameId: parentFrameId,
                params: { n: val },
                line: 2,
                retVal: 0,
                desc: `Base case reached! sum_n(${val}) returns 0.`
            });
            return 0;
        }
        
        recursionSteps.push({
            type: "descent",
            name: `sum_n(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 3,
            desc: `n > 0. Must calculate sum_n(${val - 1}) first.`
        });
        
        let childVal = traceSum(val - 1, frameId);
        let myVal = val + childVal;
        
        recursionSteps.push({
            type: "return",
            name: `sum_n(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 3,
            retVal: myVal,
            desc: `Return bubble: sum_n(${val - 1}) returned ${childVal}. Return ${val} + ${childVal} = ${myVal}.`
        });
        
        return myVal;
    }
    traceSum(n, null);
}

function generateFibonacciSteps(n) {
    let callId = 1;
    
    function traceFib(val, parentFrameId) {
        let frameId = callId++;
        recursionSteps.push({
            type: "call",
            name: `fib(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 1,
            desc: `Call fib(${val}). Check if n <= 1.`
        });
        
        if (val <= 1) {
            recursionSteps.push({
                type: "base",
                name: `fib(${val})`,
                frameId: frameId,
                parentFrameId: parentFrameId,
                params: { n: val },
                line: 2,
                retVal: val,
                desc: `Base case! fib(${val}) returns ${val}.`
            });
            return val;
        }
        
        recursionSteps.push({
            type: "descent",
            name: `fib(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 3,
            desc: `Branching left: Need value of fib(${val - 1}) first.`
        });
        
        let left = traceFib(val - 1, frameId);
        
        recursionSteps.push({
            type: "descent-right",
            name: `fib(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val, leftVal: left },
            line: 3,
            desc: `Branching right: fib(${val - 1}) returned ${left}. Now need fib(${val - 2}).`
        });
        
        let right = traceFib(val - 2, frameId);
        let myVal = left + right;
        
        recursionSteps.push({
            type: "return",
            name: `fib(${val})`,
            frameId: frameId,
            parentFrameId: parentFrameId,
            params: { n: val },
            line: 3,
            retVal: myVal,
            desc: `Combine branches: fib(${val - 1}) = ${left}, fib(${val - 2}) = ${right}. Returns ${left} + ${right} = ${myVal}.`
        });
        
        return myVal;
    }
    traceFib(n, null);
}

function stepRecursionTrace() {
    if (currentRecStepIdx < recursionSteps.length - 1) {
        currentRecStepIdx++;
        renderRecursionStep();
    } else {
        document.getElementById("rec-step-btn").disabled = true;
        const traceLog = document.getElementById("trace-log");
        traceLog.innerHTML += `<div class="log-entry success">Recursion Visualizer completed. Trace finished.</div>`;
        traceLog.scrollTop = traceLog.scrollHeight;
    }
}

function renderRecursionStep() {
    const step = recursionSteps[currentRecStepIdx];
    const stackContainer = document.getElementById("stack-container");
    const traceLog = document.getElementById("trace-log");
    
    // Clear initial empty msg
    if (currentRecStepIdx === 0) {
        stackContainer.innerHTML = "";
    }
    
    // Update logs
    let logClass = "info";
    if (step.type === "return" || step.type === "base") logClass = "pop";
    if (currentRecStepIdx === recursionSteps.length - 1 && step.type === "return") logClass = "success";
    
    traceLog.innerHTML += `<div class="log-entry ${logClass}">[Step ${currentRecStepIdx + 1}] ${step.desc}</div>`;
    traceLog.scrollTop = traceLog.scrollHeight;
    
    // Update visual Stack frames
    if (step.type === "call") {
        // Push a new frame
        const frameDiv = document.createElement("div");
        frameDiv.className = "stack-frame active";
        frameDiv.id = `frame-${step.frameId}`;
        frameDiv.innerHTML = `
            <span class="frame-title">${step.name}</span>
            <span class="frame-vars">local: n = ${step.params.n}</span>
        `;
        
        // Deactivate previous active frame visually
        const activeFrames = stackContainer.querySelectorAll(".stack-frame.active");
        activeFrames.forEach(f => f.classList.remove("active"));
        
        stackContainer.appendChild(frameDiv);
    } 
    else if (step.type === "descent" || step.type === "descent-right") {
        // Keep active, maybe adjust variables shown
        const frameDiv = document.getElementById(`frame-${step.frameId}`);
        if (frameDiv) {
            frameDiv.classList.remove("active");
            if (step.params.leftVal !== undefined) {
                frameDiv.querySelector(".frame-vars").innerHTML = `local: n = ${step.params.n}, left = ${step.params.leftVal}`;
            }
        }
    }
    else if (step.type === "base") {
        const frameDiv = document.getElementById(`frame-${step.frameId}`);
        if (frameDiv) {
            frameDiv.className = "stack-frame active";
            frameDiv.innerHTML += `<span class="frame-return">returns ${step.retVal}</span>`;
        }
    }
    else if (step.type === "return") {
        // Popping a frame
        const frameDiv = document.getElementById(`frame-${step.frameId}`);
        if (frameDiv) {
            frameDiv.className = "stack-frame popping";
            setTimeout(() => {
                frameDiv.remove();
                // Set the parent frame as active again
                if (step.parentFrameId) {
                    const parentDiv = document.getElementById(`frame-${step.parentFrameId}`);
                    if (parentDiv) parentDiv.classList.add("active");
                }
            }, 300);
        }
    }
    
    // Highlight code line
    highlightCodeLine(step.line);
}

function highlightCodeLine(lineIdx) {
    const algo = document.getElementById("rec-algorithm").value;
    const rawLines = recCodeTemplate[algo].code.split("\n");
    const container = document.getElementById("visualizer-code-display");
    
    container.innerHTML = "";
    rawLines.forEach((line, idx) => {
        const span = document.createElement("span");
        span.textContent = line + "\n";
        if (idx === lineIdx) {
            span.className = "code-highlight-line";
        }
        container.appendChild(span);
    });
}

// -------------------------------------------------------------
// Module 3: Big-O Curves Visualizer & Benchmarker
// -------------------------------------------------------------
function setupBigOSlider() {
    const slider = document.getElementById("n-slider");
    const valText = document.getElementById("n-val");
    
    slider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        valText.textContent = val;
        updateBigOGraph(val);
    });
}

function updateBigOGraph(N) {
    const svg = document.getElementById("bigo-svg");
    if (!svg) return;
    
    const width = 400;
    const height = 250;
    const originX = 40;
    const originY = 210;
    const chartW = width - originX - 20;
    const chartH = originY - 20;
    
    // Clean interactive indicators first (vertical indicator lines)
    const oldIndicators = svg.querySelectorAll(".indicator-elem");
    oldIndicators.forEach(elem => elem.remove());
    
    // Slider N position
    const sliderPct = (N - 5) / 95;
    const xPos = originX + sliderPct * chartW;
    
    // Create horizontal/vertical reference projection line
    const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vLine.setAttribute("x1", xPos);
    vLine.setAttribute("y1", originY);
    vLine.setAttribute("x2", xPos);
    vLine.setAttribute("y2", 20);
    vLine.setAttribute("stroke", "rgba(255, 255, 255, 0.15)");
    vLine.setAttribute("stroke-dasharray", "4 4");
    vLine.setAttribute("class", "indicator-elem");
    svg.appendChild(vLine);

    // Update the paths dynamically for each complexity
    function generatePath(equation) {
        let pathData = `M ${originX} ${originY}`;
        for (let xVal = 5; xVal <= 100; xVal += 5) {
            const progress = (xVal - 5) / 95;
            const x = originX + progress * chartW;
            const yVal = equation(xVal);
            
            // Cap height to chart boundary
            const y = Math.max(20, originY - yVal * (chartH / 100));
            pathData += ` L ${x} ${y}`;
        }
        return pathData;
    }
    
    // Equations mapping N to chart values (scaled)
    document.getElementById("curve-constant").setAttribute("d", generatePath(n => 5)); // O(1)
    document.getElementById("curve-log").setAttribute("d", generatePath(n => Math.log2(n) * 4)); // O(log N)
    document.getElementById("curve-linear").setAttribute("d", generatePath(n => n * 0.7)); // O(N)
    document.getElementById("curve-nlogn").setAttribute("d", generatePath(n => n * Math.log2(n) * 0.12)); // O(N log N)
    document.getElementById("curve-quadratic").setAttribute("d", generatePath(n => (n * n) * 0.012)); // O(N2)
    
    // Plot intersection dots for visual reference
    const intersectionPoints = [
        { id: "O(1)", val: 5, color: "#10b981" },
        { id: "O(log N)", val: Math.log2(N) * 4, color: "#06b6d4" },
        { id: "O(N)", val: N * 0.7, color: "#3b82f6" },
        { id: "O(N log N)", val: N * Math.log2(N) * 0.12, color: "#a855f7" },
        { id: "O(N²)", val: (N * N) * 0.012, color: "#f43f5e" }
    ];
    
    intersectionPoints.forEach(point => {
        const y = Math.max(20, originY - point.val * (chartH / 100));
        
        // Add glowing point intersection circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", xPos);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 4.5);
        circle.setAttribute("fill", point.color);
        circle.setAttribute("stroke", "#fff");
        circle.setAttribute("stroke-width", 1);
        circle.setAttribute("class", "indicator-elem");
        svg.appendChild(circle);
    });
}

function setupBenchmarker() {
    const runBtn = document.getElementById("run-benchmark-btn");
    runBtn.addEventListener("click", runLiveBenchmark);
}

async function runLiveBenchmark() {
    const benchmarkType = document.getElementById("benchmark-type").value;
    const terminal = document.getElementById("benchmark-terminal");
    const runBtn = document.getElementById("run-benchmark-btn");
    
    if (!pyodideInstance) {
        terminal.textContent = "WASM Python environment is loading, benchmark cannot run yet.";
        return;
    }
    
    runBtn.disabled = true;
    terminal.textContent = `>>> Bootstrapping timeit performance suite...\n>>> Target: ${benchmarkType.toUpperCase()} algorithms\n`;
    
    let pythonScript = "";
    
    // Configure algorithms scripts
    if (benchmarkType === "search") {
        pythonScript = `
import time
import random

# Core algorithms
def linear_search(arr, target):
    for idx, val in enumerate(arr):
        if val == target:
            return idx
    return -1

def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# Run benchmarks
sizes = [500, 2000, 5000, 10000]
linear_times = []
binary_times = []

for size in sizes:
    arr = list(range(size))
    # We query missing element to trigger worst case behavior
    target = -5 
    
    # Measure Linear Search
    t0 = time.perf_counter()
    for _ in range(50):
        linear_search(arr, target)
    t1 = time.perf_counter()
    linear_times.append((t1 - t0) * 1000 / 50) # Average time in milliseconds
    
    # Measure Binary Search
    t0 = time.perf_counter()
    for _ in range(200):
        binary_search(arr, target)
    t1 = time.perf_counter()
    binary_times.append((t1 - t0) * 1000 / 200)

print(f"LINEAR_BENCH={linear_times}")
print(f"BINARY_BENCH={binary_times}")
`;
    } 
    else if (benchmarkType === "sort") {
        pythonScript = `
import time
import random

def bubble_sort(arr):
    n = len(arr)
    # Shallow copy
    data = list(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if data[j] > data[j+1]:
                data[j], data[j+1] = data[j+1], data[j]
    return data

# Benchmark runs
# Keep sizes smaller for bubble sort to avoid lagging the browser
sizes = [50, 150, 300, 500] 
bubble_times = []
timsort_times = []

for size in sizes:
    # Average over 5 random runs
    b_acc = 0
    t_acc = 0
    for _ in range(3):
        arr = [random.randint(1, 10000) for _ in range(size)]
        
        # Bubble
        t0 = time.perf_counter()
        bubble_sort(arr)
        t1 = time.perf_counter()
        b_acc += (t1 - t0) * 1000
        
        # Timsort
        t0 = time.perf_counter()
        sorted(arr)
        t1 = time.perf_counter()
        t_acc += (t1 - t0) * 1000
        
    bubble_times.append(b_acc / 3)
    timsort_times.append(t_acc / 3)

print(f"BUBBLE_BENCH={bubble_times}")
print(f"TIMSORT_BENCH={timsort_times}")
`;
    }
    
    // Execute python script
    terminal.textContent += `>>> Running iterations on sizes...\n`;
    
    const response = await runPythonCode(pythonScript);
    terminal.textContent += response;
    
    // Parse benchmark results from outputs
    let results = { path1: [], path2: [] };
    let sizesUsed = [];
    
    if (benchmarkType === "search") {
        sizesUsed = [500, 2000, 5000, 10000];
        const linMatch = response.match(/LINEAR_BENCH=\[(.*?)\]/);
        const binMatch = response.match(/BINARY_BENCH=\[(.*?)\]/);
        
        if (linMatch && binMatch) {
            results.path1 = linMatch[1].split(',').map(Number);
            results.path2 = binMatch[1].split(',').map(Number);
        }
        
        plotEmpiricalGraph(sizesUsed, results.path1, results.path2, "Linear Search O(N)", "Binary Search O(log N)");
    } 
    else if (benchmarkType === "sort") {
        sizesUsed = [50, 150, 300, 500];
        const bubbleMatch = response.match(/BUBBLE_BENCH=\[(.*?)\]/);
        const timMatch = response.match(/TIMSORT_BENCH=\[(.*?)\]/);
        
        if (bubbleMatch && timMatch) {
            results.path1 = bubbleMatch[1].split(',').map(Number);
            results.path2 = timMatch[1].split(',').map(Number);
        }
        
        plotEmpiricalGraph(sizesUsed, results.path1, results.path2, "Bubble Sort O(N²)", "Built-in Sort O(N log N)");
    }
    
    runBtn.disabled = false;
}

function plotEmpiricalGraph(sizes, times1, times2, label1, label2) {
    const svg = document.getElementById("empirical-svg");
    const path1 = document.getElementById("emp-path-1");
    const path2 = document.getElementById("emp-path-2");
    
    // Update legend titles
    document.getElementById("emp-legend-lbl1").textContent = label1;
    document.getElementById("emp-legend-lbl2").textContent = label2;
    
    if (!times1 || !times2 || times1.length === 0) return;
    
    const width = 400;
    const height = 220;
    const originX = 40;
    const originY = 180;
    const chartW = width - originX - 20;
    const chartH = originY - 20;
    
    // Clean old data points first
    const oldDots = svg.querySelectorAll(".bench-dot");
    oldDots.forEach(d => d.remove());
    
    // Scale max height based on worst timings
    const maxTime = Math.max(...times1, ...times2, 0.001); 
    const minSize = sizes[0];
    const maxSize = sizes[sizes.length - 1];
    
    function scaleX(size) {
        return originX + ((size - minSize) / (maxSize - minSize)) * chartW;
    }
    
    function scaleY(time) {
        return originY - (time / maxTime) * chartH;
    }
    
    // Draw paths
    let p1Data = `M ${scaleX(sizes[0])} ${scaleY(times1[0])}`;
    let p2Data = `M ${scaleX(sizes[0])} ${scaleY(times2[0])}`;
    
    for (let i = 0; i < sizes.length; i++) {
        const x = scaleX(sizes[i]);
        const y1 = scaleY(times1[i]);
        const y2 = scaleY(times2[i]);
        
        if (i > 0) {
            p1Data += ` L ${x} ${y1}`;
            p2Data += ` L ${x} ${y2}`;
        }
        
        // Draw actual data dots on plot
        const dot1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot1.setAttribute("cx", x);
        dot1.setAttribute("cy", y1);
        dot1.setAttribute("r", 4);
        dot1.setAttribute("fill", "#f43f5e");
        dot1.setAttribute("class", "bench-dot");
        
        const dot2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot2.setAttribute("cx", x);
        dot2.setAttribute("cy", y2);
        dot2.setAttribute("r", 4);
        dot2.setAttribute("fill", "#10b981");
        dot2.setAttribute("class", "bench-dot");
        
        svg.appendChild(dot1);
        svg.appendChild(dot2);
    }
    
    path1.setAttribute("d", p1Data);
    path2.setAttribute("d", p2Data);
}

// -------------------------------------------------------------
// Module 5: Interactive Quiz Mechanics
// -------------------------------------------------------------
const quizQuestions = [
    {
        num: 1,
        question: "In Python, which of the following is MUTABLE (can be modified directly in place after creation)?",
        options: [
            "A string: s = 'Hello'",
            "A tuple: point = (10, 20)",
            "A list: values = [1, 2, 3]",
            "An integer: count = 42"
        ],
        answer: 2, // list
        explanation: "Lists are dynamic mutable arrays. Under the hood, Python lists can grow and update values dynamically. In contrast, strings, tuples, and numeric values are immutable; any 'modification' operation actually creates a new object in memory."
    },
    {
        num: 2,
        question: "When writing classes in Python, what does the 'self' parameter represents inside class methods?",
        options: [
            "A reserved keyword equivalent to static in C++",
            "An implicit reference to the active class object instance, analogous to passing a struct pointer to functions in C",
            "A pointer to the parent class for resolving inheritance",
            "A local dictionary referencing global variables"
        ],
        answer: 1, // implicit reference
        explanation: "Bingo! Python's 'self' operates exactly like explicitly passing a pointer of a struct (e.g. print_student(&s)) in C. When you write s.print_student(), Python automatically parses 's' as the first parameter 'self' inside the method declaration."
    },
    {
        num: 3,
        question: "If you want to perform rapid membership check ('x in collection') with O(1) average lookup complexity, which data structure should you select?",
        options: [
            "A List (e.g., [1, 2, 3])",
            "A Dictionary (e.g., {'name': 'Alice'}) or Set",
            "A Tuple (e.g., (1, 2, 3))",
            "A String character array"
        ],
        answer: 1, // Dictionary
        explanation: "Python dictionaries (and sets) are implemented using hash tables with average lookup complexity of O(1). Lists and tuples, on the other hand, are indexed arrays requiring an O(N) linear search traversal to locate elements in the worst case."
    },
    {
        num: 4,
        question: "How does Python handle memory freeing of objects that are no longer needed, compared to C's free() function?",
        options: [
            "Python doesn't free memory, causing major leaks unless sys.exit() is called",
            "The developer must explicitly write del(obj) to release RAM",
            "Python uses automatic Garbage Collection (via reference counting and generational cycles)",
            "Python requires placing functions in try-finally blocks to clean heap structures"
        ],
        answer: 2, // Garbage collection
        explanation: "Python handles memory management dynamically. It tracks the reference count of variables pointing to an object. When an object's reference count drops to 0 (meaning nothing references it), Python's GC automatically reclaims its memory, protecting you from manual leaks."
    },
    {
        num: 5,
        question: "What syntactic rule is mandatory to define a block of code (like loops or condition branches) in Python?",
        options: [
            "Enclosing statements inside curly brackets {}",
            "Ending every statement with a semicolon ;",
            "Consistent indentation levels (typically 4 spaces) after a colon symbol :",
            "Capitalizing keywords like FOR, WHILE, and IF"
        ],
        answer: 2, // Indentation
        explanation: "Python abandons curly braces and semicolons completely. Stating a colon ':' tells Python a sub-block is beginning, and the subsequent lines must share the exact indentation level. Mixing tabs and spaces yields IndentationError!"
    }
];

let currentQuizIdx = 0;
let userAnswers = Array(quizQuestions.length).fill(null);

function loadQuizQuestion() {
    const container = document.getElementById("quiz-container");
    if (!container) return;
    
    if (currentQuizIdx >= quizQuestions.length) {
        showQuizResults();
        return;
    }
    
    const q = quizQuestions[currentQuizIdx];
    
    container.innerHTML = `
        <div class="quiz-question-card glass">
            <div class="quiz-q-num">Question ${q.num} of ${quizQuestions.length}</div>
            <div class="quiz-q-text">${q.question}</div>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <button class="quiz-option" onclick="selectQuizOption(${i})">${opt}</button>
                `).join('')}
            </div>
            <div class="quiz-explanation" id="quiz-explanation-box" style="display:none;"></div>
            <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
                <button class="btn btn-primary" id="quiz-next-btn" style="display:none;" onclick="nextQuizQuestion()">Next Question <i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    `;
}

function selectQuizOption(optionIdx) {
    const q = quizQuestions[currentQuizIdx];
    const options = document.querySelectorAll(".quiz-option");
    
    // Disable all options from clicks
    options.forEach(opt => opt.disabled = true);
    
    // Mark selection
    userAnswers[currentQuizIdx] = optionIdx;
    
    const isCorrect = (optionIdx === q.answer);
    
    // Set styles
    options.forEach((opt, idx) => {
        if (idx === q.answer) {
            opt.classList.add("correct");
        } else if (idx === optionIdx) {
            opt.classList.add("incorrect");
        }
    });
    
    // Render explanation
    const explainBox = document.getElementById("quiz-explanation-box");
    explainBox.style.display = "block";
    if (isCorrect) {
        explainBox.className = "quiz-explanation correct-explain";
        explainBox.innerHTML = `
            <h5 class="correct-title"><i class="fa-solid fa-circle-check"></i> Correct!</h5>
            <p>${q.explanation}</p>
        `;
    } else {
        explainBox.className = "quiz-explanation incorrect-explain";
        explainBox.innerHTML = `
            <h5 class="incorrect-title"><i class="fa-solid fa-circle-xmark"></i> Incorrect</h5>
            <p>${q.explanation}</p>
        `;
    }
    
    // Show Next Button
    document.getElementById("quiz-next-btn").style.display = "inline-flex";
}

function nextQuizQuestion() {
    currentQuizIdx++;
    loadQuizQuestion();
}

function showQuizResults() {
    const container = document.getElementById("quiz-container");
    container.style.display = "none";
    
    const summaryCard = document.getElementById("quiz-summary-card");
    summaryCard.style.display = "flex";
    
    // Compute Score
    let score = 0;
    userAnswers.forEach((ans, idx) => {
        if (ans === quizQuestions[idx].answer) {
            score++;
        }
    });
    
    document.getElementById("quiz-score-num").textContent = score;
    document.getElementById("quiz-score-total").textContent = quizQuestions.length;
    
    const fbText = document.getElementById("quiz-feedback-text");
    if (score === quizQuestions.length) {
        fbText.textContent = "Spectacular! You are fully prepared to teach the DSA curriculum in Python. You've mastered C to Python syntax structures!";
    } else if (score >= 3) {
        fbText.textContent = "Great job! You have a solid grasp of structural changes. Read the feedback answers to perfect your knowledge.";
    } else {
        fbText.textContent = "Keep reviewing! Understanding memory paradigms (GC, structures, pointers vs self) is essential when shifting to Python.";
    }
}

function resetQuiz() {
    currentQuizIdx = 0;
    userAnswers = Array(quizQuestions.length).fill(null);
    
    document.getElementById("quiz-summary-card").style.display = "none";
    const container = document.getElementById("quiz-container");
    container.style.display = "block";
    
    loadQuizQuestion();
}
