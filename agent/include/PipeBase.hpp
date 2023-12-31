/*
 * Author : see AUTHORS
 * Licence: MIT, see LICENSE
 */

#ifndef NAMEDPIPEBASE_HPP
#define NAMEDPIPEBASE_HPP

#include "Constants.hpp"
#include "Logging.hpp"
//#include "ProcessBase.hpp"

#include <cerrno>
#include <string>
#include <vector>

#include <unistd.h>

#define READ_SIZE 1

class ProcessBase;
/** Class represeting interface of the Pipe */
class PipeBase {

    protected:

        /**
         * @brief   Pure virtual function creating the pipe
         */
        virtual void createPipe(bool is_NONBLOCK_) = 0;

        /**
         * @brief   Pure virtual function reading content of the pipe
         * @param   c [out] Read character
         * @return  Number of read characters
         */
        virtual int readChar(char &c) = 0;

        /**
         * @brief reads a char from the pipe. Blocks if it is not available
         * 
         * @return char The read character or EOF if the pipe has been closed
         * @throws std::runtime_error on other errors
         */
        virtual int readChar() = 0;
    public:
    virtual ~PipeBase() {}

	/**
	 * @brief   Pure virtual function stating whether it is possible to read
	 *	    from pipe
	 * @return  True when possible, False otherwise
	 */
	virtual bool canRead() const = 0;

        /**
         * @brief   Pure virtual function closing all ends of pipe using function from subclasses
         * @return  0 or error number of system close operation
         */
        int closeAll();

        /**
         * @brief   Pure virtual function closing read-end of the pipe
         * @return  0 or error number of system close operation
         */
        virtual int closeRead() = 0;

        /**
         * @brief   Pure virtual function closing write-end of the pipe
         * @return  0 or error number of system close operation
         */
        virtual int closeWrite() = 0;

        /**
         * @brief   Check if file descriptor (end of pipe) is open
         * @return  True when file descriptor is open, False otherwise
         */
        virtual bool isReadOpen() const = 0;

        /**
         * @brief   Check if file descriptor (end of pipe) is open
         * @return  True when file descriptor is open, False otherwise
         */
        virtual bool isWriteOpen() const = 0;

        /**
         * @brief   Reads line from the pipe
         * @return  Read line
         */
        std::string readLine();

        virtual void waitForAvailableOutput() const = 0;

        /**
         * @brief   Pure virtual function writing message to the pipe
         * @param   message [in] Message to write to pipe
         * @throws std::runtime_error When there is an unexpected error.
         * @return  Number of characters written, or -1 (other end of pipe is closed).
         */
        virtual int writeMessage(std::string &message) = 0;

};

#endif //NAMEDPIPE_HPP
