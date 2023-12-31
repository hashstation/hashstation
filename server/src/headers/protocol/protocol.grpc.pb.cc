// Generated by the gRPC C++ plugin.
// If you make any local change, they will be lost.
// source: protocol.proto

#include "protocol.pb.h"
#include "protocol.grpc.pb.h"

#include <functional>
#include <grpcpp/impl/codegen/async_stream.h>
#include <grpcpp/impl/codegen/async_unary_call.h>
#include <grpcpp/impl/codegen/channel_interface.h>
#include <grpcpp/impl/codegen/client_unary_call.h>
#include <grpcpp/impl/codegen/client_callback.h>
#include <grpcpp/impl/codegen/method_handler_impl.h>
#include <grpcpp/impl/codegen/rpc_service_method.h>
#include <grpcpp/impl/codegen/server_callback.h>
#include <grpcpp/impl/codegen/service_type.h>
#include <grpcpp/impl/codegen/sync_stream.h>
namespace proto {

static const char* PCFG_method_names[] = {
  "/proto.PCFG/Connect",
  "/proto.PCFG/Disconnect",
  "/proto.PCFG/GetNextItems",
  "/proto.PCFG/SendResult",
  "/proto.PCFG/Kill",
};

std::unique_ptr< PCFG::Stub> PCFG::NewStub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options) {
  (void)options;
  std::unique_ptr< PCFG::Stub> stub(new PCFG::Stub(channel));
  return stub;
}

PCFG::Stub::Stub(const std::shared_ptr< ::grpc::ChannelInterface>& channel)
  : channel_(channel), rpcmethod_Connect_(PCFG_method_names[0], ::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  , rpcmethod_Disconnect_(PCFG_method_names[1], ::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  , rpcmethod_GetNextItems_(PCFG_method_names[2], ::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  , rpcmethod_SendResult_(PCFG_method_names[3], ::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  , rpcmethod_Kill_(PCFG_method_names[4], ::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  {}

::grpc::Status PCFG::Stub::Connect(::grpc::ClientContext* context, const ::proto::Empty& request, ::proto::ConnectResponse* response) {
  return ::grpc::internal::BlockingUnaryCall(channel_.get(), rpcmethod_Connect_, context, request, response);
}

void PCFG::Stub::experimental_async::Connect(::grpc::ClientContext* context, const ::proto::Empty* request, ::proto::ConnectResponse* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_Connect_, context, request, response, std::move(f));
}

void PCFG::Stub::experimental_async::Connect(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::proto::ConnectResponse* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_Connect_, context, request, response, std::move(f));
}

::grpc::ClientAsyncResponseReader< ::proto::ConnectResponse>* PCFG::Stub::AsyncConnectRaw(::grpc::ClientContext* context, const ::proto::Empty& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::ConnectResponse>::Create(channel_.get(), cq, rpcmethod_Connect_, context, request, true);
}

::grpc::ClientAsyncResponseReader< ::proto::ConnectResponse>* PCFG::Stub::PrepareAsyncConnectRaw(::grpc::ClientContext* context, const ::proto::Empty& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::ConnectResponse>::Create(channel_.get(), cq, rpcmethod_Connect_, context, request, false);
}

::grpc::Status PCFG::Stub::Disconnect(::grpc::ClientContext* context, const ::proto::Empty& request, ::proto::Empty* response) {
  return ::grpc::internal::BlockingUnaryCall(channel_.get(), rpcmethod_Disconnect_, context, request, response);
}

void PCFG::Stub::experimental_async::Disconnect(::grpc::ClientContext* context, const ::proto::Empty* request, ::proto::Empty* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_Disconnect_, context, request, response, std::move(f));
}

void PCFG::Stub::experimental_async::Disconnect(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::proto::Empty* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_Disconnect_, context, request, response, std::move(f));
}

::grpc::ClientAsyncResponseReader< ::proto::Empty>* PCFG::Stub::AsyncDisconnectRaw(::grpc::ClientContext* context, const ::proto::Empty& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::Empty>::Create(channel_.get(), cq, rpcmethod_Disconnect_, context, request, true);
}

::grpc::ClientAsyncResponseReader< ::proto::Empty>* PCFG::Stub::PrepareAsyncDisconnectRaw(::grpc::ClientContext* context, const ::proto::Empty& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::Empty>::Create(channel_.get(), cq, rpcmethod_Disconnect_, context, request, false);
}

::grpc::Status PCFG::Stub::GetNextItems(::grpc::ClientContext* context, const ::proto::NextRequest& request, ::proto::Items* response) {
  return ::grpc::internal::BlockingUnaryCall(channel_.get(), rpcmethod_GetNextItems_, context, request, response);
}

void PCFG::Stub::experimental_async::GetNextItems(::grpc::ClientContext* context, const ::proto::NextRequest* request, ::proto::Items* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_GetNextItems_, context, request, response, std::move(f));
}

void PCFG::Stub::experimental_async::GetNextItems(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::proto::Items* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_GetNextItems_, context, request, response, std::move(f));
}

::grpc::ClientAsyncResponseReader< ::proto::Items>* PCFG::Stub::AsyncGetNextItemsRaw(::grpc::ClientContext* context, const ::proto::NextRequest& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::Items>::Create(channel_.get(), cq, rpcmethod_GetNextItems_, context, request, true);
}

::grpc::ClientAsyncResponseReader< ::proto::Items>* PCFG::Stub::PrepareAsyncGetNextItemsRaw(::grpc::ClientContext* context, const ::proto::NextRequest& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::Items>::Create(channel_.get(), cq, rpcmethod_GetNextItems_, context, request, false);
}

::grpc::Status PCFG::Stub::SendResult(::grpc::ClientContext* context, const ::proto::CrackingResponse& request, ::proto::ResultResponse* response) {
  return ::grpc::internal::BlockingUnaryCall(channel_.get(), rpcmethod_SendResult_, context, request, response);
}

void PCFG::Stub::experimental_async::SendResult(::grpc::ClientContext* context, const ::proto::CrackingResponse* request, ::proto::ResultResponse* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_SendResult_, context, request, response, std::move(f));
}

void PCFG::Stub::experimental_async::SendResult(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::proto::ResultResponse* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_SendResult_, context, request, response, std::move(f));
}

::grpc::ClientAsyncResponseReader< ::proto::ResultResponse>* PCFG::Stub::AsyncSendResultRaw(::grpc::ClientContext* context, const ::proto::CrackingResponse& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::ResultResponse>::Create(channel_.get(), cq, rpcmethod_SendResult_, context, request, true);
}

::grpc::ClientAsyncResponseReader< ::proto::ResultResponse>* PCFG::Stub::PrepareAsyncSendResultRaw(::grpc::ClientContext* context, const ::proto::CrackingResponse& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::ResultResponse>::Create(channel_.get(), cq, rpcmethod_SendResult_, context, request, false);
}

::grpc::Status PCFG::Stub::Kill(::grpc::ClientContext* context, const ::proto::Empty& request, ::proto::Empty* response) {
  return ::grpc::internal::BlockingUnaryCall(channel_.get(), rpcmethod_Kill_, context, request, response);
}

void PCFG::Stub::experimental_async::Kill(::grpc::ClientContext* context, const ::proto::Empty* request, ::proto::Empty* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_Kill_, context, request, response, std::move(f));
}

void PCFG::Stub::experimental_async::Kill(::grpc::ClientContext* context, const ::grpc::ByteBuffer* request, ::proto::Empty* response, std::function<void(::grpc::Status)> f) {
  return ::grpc::internal::CallbackUnaryCall(stub_->channel_.get(), stub_->rpcmethod_Kill_, context, request, response, std::move(f));
}

::grpc::ClientAsyncResponseReader< ::proto::Empty>* PCFG::Stub::AsyncKillRaw(::grpc::ClientContext* context, const ::proto::Empty& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::Empty>::Create(channel_.get(), cq, rpcmethod_Kill_, context, request, true);
}

::grpc::ClientAsyncResponseReader< ::proto::Empty>* PCFG::Stub::PrepareAsyncKillRaw(::grpc::ClientContext* context, const ::proto::Empty& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderFactory< ::proto::Empty>::Create(channel_.get(), cq, rpcmethod_Kill_, context, request, false);
}

PCFG::Service::Service() {
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      PCFG_method_names[0],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< PCFG::Service, ::proto::Empty, ::proto::ConnectResponse>(
          std::mem_fn(&PCFG::Service::Connect), this)));
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      PCFG_method_names[1],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< PCFG::Service, ::proto::Empty, ::proto::Empty>(
          std::mem_fn(&PCFG::Service::Disconnect), this)));
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      PCFG_method_names[2],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< PCFG::Service, ::proto::NextRequest, ::proto::Items>(
          std::mem_fn(&PCFG::Service::GetNextItems), this)));
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      PCFG_method_names[3],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< PCFG::Service, ::proto::CrackingResponse, ::proto::ResultResponse>(
          std::mem_fn(&PCFG::Service::SendResult), this)));
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      PCFG_method_names[4],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< PCFG::Service, ::proto::Empty, ::proto::Empty>(
          std::mem_fn(&PCFG::Service::Kill), this)));
}

PCFG::Service::~Service() {
}

::grpc::Status PCFG::Service::Connect(::grpc::ServerContext* context, const ::proto::Empty* request, ::proto::ConnectResponse* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}

::grpc::Status PCFG::Service::Disconnect(::grpc::ServerContext* context, const ::proto::Empty* request, ::proto::Empty* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}

::grpc::Status PCFG::Service::GetNextItems(::grpc::ServerContext* context, const ::proto::NextRequest* request, ::proto::Items* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}

::grpc::Status PCFG::Service::SendResult(::grpc::ServerContext* context, const ::proto::CrackingResponse* request, ::proto::ResultResponse* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}

::grpc::Status PCFG::Service::Kill(::grpc::ServerContext* context, const ::proto::Empty* request, ::proto::Empty* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}


}  // namespace proto

