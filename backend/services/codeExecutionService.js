// CODE EXECUTION SERVICE

import { VM } from 'vm2';

// Execute JavaScript code safely in a sandbox
const executeJavaScript = async (code, testCases) => {
  const results = [];

  try {
    for (const testCase of testCases) {
      try {
        // Create a new VM instance for each test case
        const vm = new VM({
          timeout: 5000, // 5 second timeout
          sandbox: {},
        });

        // Prepare the code with test input
        const wrappedCode = `
          ${code}
          
          // Parse input (handle both string and parsed input)
          let input;
          try {
            input = JSON.parse('${testCase.input.replace(/'/g, "\\'")}');
          } catch {
            input = '${testCase.input.replace(/'/g, "\\'")}';
          }
          
          // Try to find and call the main function
          let result;
          if (typeof twoSum !== 'undefined') result = twoSum(...(Array.isArray(input) ? input : [input]));
          else if (typeof reverseString !== 'undefined') result = reverseString(input);
          else if (typeof isPalindrome !== 'undefined') result = isPalindrome(input);
          else if (typeof binarySearch !== 'undefined') result = binarySearch(...(Array.isArray(input) ? input : [input]));
          else {
            // Try to execute the code directly
            result = eval(code);
          }
          
          result;
        `;

        const output = vm.run(wrappedCode);
        
        // Compare output with expected
        const outputStr = JSON.stringify(output);
        const expectedStr = testCase.expectedOutput;
        
        const passed = outputStr === expectedStr || 
                      output.toString() === expectedStr ||
                      JSON.stringify(output) === JSON.stringify(JSON.parse(expectedStr));

        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: outputStr,
          passed,
          error: null,
          isHidden: testCase.isHidden || false,
        });
      } catch (execError) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          passed: false,
          error: execError.message,
          isHidden: testCase.isHidden || false,
        });
      }
    }

    // Calculate summary
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    const allPassed = passedCount === totalCount;

    return {
      success: true,
      results,
      summary: {
        passed: passedCount,
        total: totalCount,
        allPassed,
        percentage: totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      results: [],
    };
  }
};

// Execute Python code (placeholder - requires Python runtime)
const executePython = async (code, testCases) => {
  // This would require a Python execution environment
  // For now, return a not implemented message
  return {
    success: false,
    error: 'Python execution not yet implemented. Please use JavaScript for now.',
    results: [],
  };
};

// Execute code based on language
const executeCode = async (language, code, testCases) => {
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return await executeJavaScript(code, testCases);
    
    case 'python':
    case 'py':
      return await executePython(code, testCases);
    
    default:
      return {
        success: false,
        error: `Language ${language} is not supported yet. Currently supporting: JavaScript`,
        results: [],
      };
  }
};

// Validate code syntax
const validateCode = (language, code) => {
  if (!code || code.trim() === '') {
    return {
      valid: false,
      error: 'Code cannot be empty',
    };
  }

  // Basic validation for JavaScript
  if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
    try {
      // Try to parse the code (doesn't execute it)
      new Function(code);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Syntax Error: ${error.message}`,
      };
    }
  }

  return { valid: true };
};

export {
    executeCode,
    validateCode
};
